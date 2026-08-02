import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;

// Kept free of any database or framework import so the create-admin CLI can use
// it without opening a Prisma connection.

// Stored as `scrypt$<salt>$<hash>` so the format is self-describing and we can
// tell a hashed password from a legacy plain-text one.
export async function hashPassword(plainPassword) {
    const salt = randomBytes(16).toString("hex");
    const derived = await scrypt(plainPassword, salt, KEY_LENGTH);
    return `scrypt$${salt}$${derived.toString("hex")}`;
}

// Returns { valid, needsUpgrade }. `needsUpgrade` is true when the row still
// holds a plain-text password, so the caller can re-save it hashed.
export async function verifyPassword(plainPassword, storedPassword) {
    if (!plainPassword || !storedPassword) return { valid: false, needsUpgrade: false };

    if (storedPassword.startsWith("scrypt$")) {
        const [, salt, hash] = storedPassword.split("$");
        if (!salt || !hash) return { valid: false, needsUpgrade: false };
        const derived = await scrypt(plainPassword, salt, KEY_LENGTH);
        const expected = Buffer.from(hash, "hex");
        const valid = expected.length === derived.length && timingSafeEqual(expected, derived);
        return { valid, needsUpgrade: false };
    }

    // Admin rows seeded by hand may hold the password verbatim. Accept it once
    // and let verifyAdminLogin replace it with a hash.
    const given = Buffer.from(plainPassword);
    const stored = Buffer.from(storedPassword);
    const valid = given.length === stored.length && timingSafeEqual(given, stored);
    return { valid, needsUpgrade: valid };
}