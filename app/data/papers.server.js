import { PrismaClient } from '@prisma/client';

// Public origin where uploaded manuscripts are served from. Every manuscript
// link is built from this base, so it always starts with the conference domain.
const BASE_URL = "https://wrt2026.com.ua";

const prisma = new PrismaClient();

export function manuscriptLink(filename) {
    return `${BASE_URL}/uploads/papers/${filename}`;
}

// True when the email exists in the Registration table (the author must be a
// registered conference participant before they can submit a paper).
export async function emailIsRegistered(email) {
    const trimmed = (email || "").trim();
    if (!trimmed) return false;
    const found = await prisma.registration.findFirst({
        where: { email: trimmed },
        select: { id: true },
    });
    return Boolean(found);
}

export async function savePaper({ author, email, co_authors, organization, paper_title, filename }) {
    return prisma.paper.create({
        data: {
            author,
            email,
            co_authors: co_authors || null,
            organization: organization || null,
            paper_title,
            manuscript_link: manuscriptLink(filename),
        },
        select: { id: true, manuscript_link: true },
    });
}