import { createCookieSessionStorage } from "react-router-dom";

const sessionSecret = process.env.SESSION_SECRET || "super-secret";

const storage = createCookieSessionStorage({
    cookie: {
        name: "__session",
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        httpOnly: true,
    },
});

export const { getSession, commitSession, destroySession } = storage;
