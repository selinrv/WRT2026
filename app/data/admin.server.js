import { redirect } from "react-router";

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { hashPassword, verifyPassword } from "./password.server.js";
import { isValidPaperStatus } from "./paper-status.js";
import { getSession, commitSession } from "./session.server.js";

const ADMIN_SESSION_KEY = "adminId";
// An admin stays signed in for a working day, then has to log in again.
const SESSION_MAX_AGE = 60 * 60 * 8;

function admins() {
    if (!prisma.admins) {
        throw new Error(
            "Prisma client has no `admins` model — run `npx prisma generate` on the server and restart it."
        );
    }
    return prisma.admins;
}

export async function verifyAdminLogin(email, password) {
    const trimmed = (email || "").trim();
    if (!trimmed || !password) return null;

    const admin = await admins().findUnique({ where: { email: trimmed } });
    if (!admin) {
        // Burn the same work a real comparison costs, so a missing email and a
        // wrong password can't be told apart by response time.
        await hashPassword(password);
        return null;
    }

    const { valid, needsUpgrade } = await verifyPassword(password, admin.password);
    if (!valid) return null;

    if (needsUpgrade) {
        try {
            await admins().update({
                where: { id: admin.id },
                data: { password: await hashPassword(password) },
            });
        } catch (error) {
            // The login itself is still good — never fail it over the rewrite.
            console.log("Admin password upgrade failed:", error);
        }
    }

    return { id: admin.id, email: admin.email };
}

export async function createAdminSession(adminId, redirectTo = "/admin") {
    const session = await getSession();
    session.set(ADMIN_SESSION_KEY, adminId);
    return redirect(redirectTo, {
        headers: { "Set-Cookie": await commitSession(session, { maxAge: SESSION_MAX_AGE }) },
    });
}

// The signed-in admin, or null.
export async function getAdminFromSession(request) {
    const session = await getSession(request.headers.get("Cookie"));
    const adminId = session.get(ADMIN_SESSION_KEY);
    if (!adminId) return null;

    const admin = await admins().findUnique({
        where: { id: Number(adminId) },
        select: { id: true, email: true },
    });
    return admin ?? null;
}

export async function requireAdmin(request) {
    const admin = await getAdminFromSession(request);
    if (!admin) throw redirect("/admin");
    return admin;
}

export async function logoutAdmin(request, redirectTo = "/admin") {
    const session = await getSession(request.headers.get("Cookie"));
    // Unset rather than destroy: the same cookie also carries the Google tokens.
    session.unset(ADMIN_SESSION_KEY);
    return redirect(redirectTo, {
        headers: { "Set-Cookie": await commitSession(session) },
    });
}

// Every submitted manuscript, newest first.
export async function listPapers() {
    return prisma.paper.findMany({
        orderBy: { createdAt: "desc" },
    });
}

// Moves a paper to a new review state.
export async function updatePaperStatus(id, status) {
    if (!isValidPaperStatus(status)) {
        throw new Error(`Unknown paper status: ${status}`);
    }

    const current = await prisma.paper.findUnique({
        where: { id },
        select: { id: true, author: true, email: true, paper_title: true, status: true, notes: true },
    });
    if (!current) return null;
    if (current.status === status) return { ...current, changed: false };

    try {
        const updated = await prisma.paper.update({
            where: { id },
            data: { status },
            select: { id: true, author: true, email: true, paper_title: true, status: true, notes: true },
        });
        return { ...updated, changed: true };
    } catch (error) {
        if (error?.code === "P2025") return null;
        throw error;
    }
}


const MAX_NOTES_LENGTH = 10000;

export async function updatePaperNotes(id, notes) {
    const trimmed = (notes || "").trim().slice(0, MAX_NOTES_LENGTH);

    try {
        return await prisma.paper.update({
            where: { id },
            data: { notes: trimmed || null },
            select: { id: true, notes: true },
        });
    } catch (error) {
        if (error?.code === "P2025") return null;
        throw error;
    }
}


export async function deletePaper(id) {
    try {
        await prisma.paper.delete({ where: { id } });
        return true;
    } catch (error) {
        if (error?.code === "P2025") return false;
        throw error;
    }
}