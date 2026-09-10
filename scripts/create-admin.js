// Creates an admin account, or resets the password of an existing one.
//
//   npm run create-admin -- admin@wrt2026.com.ua "your-password"
//
// The password is stored scrypt-hashed, never in plain text.
import { PrismaClient } from "@prisma/client";

import { hashPassword } from "../app/data/password.server.js";

const [email, password] = process.argv.slice(2);

if (!email || !password) {
    console.error('Usage: npm run create-admin -- <email> "<password>"');
    process.exit(1);
}

if (password.length < 8) {
    console.error("Please choose a password of at least 8 characters.");
    process.exit(1);
}

const prisma = new PrismaClient();

try {
    const hashed = await hashPassword(password);
    const admin = await prisma.admins.upsert({
        where: { email: email.trim() },
        update: { password: hashed },
        create: { email: email.trim(), password: hashed },
    });
    console.log(`Admin ready: ${admin.email} (id ${admin.id})`);
} catch (error) {
    console.error("Could not save the admin:", error.message);
    process.exitCode = 1;
} finally {
    await prisma.$disconnect();
}