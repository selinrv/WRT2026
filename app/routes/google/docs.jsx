// app/routes/docs.demo.tsx
import { LoaderFunctionArgs } from "@remix-run/node";
import { google } from "googleapis";
import { getSession } from "~/data/session.server";

export async function loader({ request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const tokens = session.get("google_tokens");
    if (!tokens) throw new Response("Unauthorized", { status: 401 });

    const auth = new google.auth.OAuth2();
    auth.setCredentials(tokens);

    const docs = google.docs({ version: "v1", auth });
    const drive = google.drive({ version: "v3", auth });

    // 1) Create an empty Google Doc
    const created = await docs.documents.create({
        requestBody: { title: "Conference Paper Draft" },
    });

    // 2) Write some content
    await docs.documents.batchUpdate({
        documentId: created.data.documentId,
        requestBody: {
        requests: [
            { insertText: { location: { index: 1 }, text: "Hello, Remix + Google Docs!\n" } },
            { insertText: { location: { index: 1 }, text: "Title: " } },
        ],
    },
});

    // 3) Export that Doc as PDF (via Drive API)
    const pdf = await drive.files.export(
        { fileId: created.data.documentId, mimeType: "application/pdf" },
        { responseType: "arraybuffer" }
    );

    return new Response(Buffer.from(pdf.data), {
        headers: {
            "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="paper.pdf"`,
        },
    });
}
export default function Demo() { return null; }
