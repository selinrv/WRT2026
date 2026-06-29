import { PrismaClient } from '@prisma/client';

// Public origin where uploaded manuscripts are served from. Every manuscript
// link is built from this base, so it always starts with the conference domain.
const BASE_URL = "https://wrt2026.com.ua";

const prisma = new PrismaClient();

export function manuscriptLink(filename) {
    return `${BASE_URL}/uploads/papers/${filename}`;
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