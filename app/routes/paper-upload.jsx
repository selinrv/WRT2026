import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import PaperUpload from "../components/paperupload.jsx";

export function meta() {
    return [
        { title: "Paper Submission - WRT2026 Conference" },
        {
            name: "description",
            content: "Submit your full paper for WRT2026 - Welding and Related Technologies Conference 2026 in Uzhhorod, Ukraine.",
        },
    ];
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "papers");
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const ACCEPTED_EXT = [".pdf", ".doc", ".docx"];

function sanitize(name) {
    return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

async function saveUpload(file) {
    if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) return null;
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ACCEPTED_EXT.includes(ext)) {
        throw new Error(`Unsupported file type: ${ext}`);
    }
    if (file.size > MAX_FILE_BYTES) {
        throw new Error("File exceeds the 25 MB limit.");
    }
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${Date.now()}-${sanitize(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);
    return { filename, originalName: file.name, size: file.size };
}

export async function action({ request }) {
    const formData = await request.formData();

    // Server-side validation mirrors the client steps.
    const errors = {};
    const author = formData.get("author");
    const email = formData.get("email");
    const title = formData.get("abstract_title");
    const paper = formData.get("paper");

    if (!author?.trim()) errors.author = "Author name is required.";
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "A valid email is required.";
    if (!title?.trim()) errors.abstract_title = "Paper title is required.";
    if (!paper || typeof paper.arrayBuffer !== "function" || paper.size === 0) {
        errors.paper = "Please attach your manuscript.";
    }
    console.log(paper)
    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    let savedPaper;
    let savedSupplementary = null;
    try {
        savedPaper = await saveUpload(paper);
        const supplementary = formData.get("supplementary");
        savedSupplementary = await saveUpload(supplementary);
    } catch (error) {
        console.log("Paper upload error:", error);
        return { errors: { paper: error.message } };
    }

    try {
        const { savePaper } = await import("../data/papers.server");
        const record = await savePaper({
            author,
            email,
            co_authors: formData.get("co_authors") || "",
            organization: formData.get("institutions") || "",
            paper_title: title,
            filename: savedPaper.filename,
        });
        console.log("Saved paper submission:", record.id, record.manuscript_link);
    } catch (error) {
        console.log("Paper DB save error:", error);
        return { errors: { paper: "We saved your file but couldn't record the submission. Please contact the office." } };
    }

    return { success: true };
}

export default function PaperUploadRoute() {
    return <PaperUpload />;
}