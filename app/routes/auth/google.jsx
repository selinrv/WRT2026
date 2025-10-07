import {  redirect } from "react-router-dom";
import { google } from "googleapis";

export async function loader({ request }) {
    const oauth2 = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URL
);

    const url = oauth2.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/documents", // read/write Docs
            "https://www.googleapis.com/auth/drive.file", // create/export files you create
        ],
    });

    return redirect(url);
}
export default function Start() { return null; }