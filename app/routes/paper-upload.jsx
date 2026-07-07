import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import PaperUpload from "../components/paperupload.jsx";
import PaperStatusChecker from "../components/paperstatus.jsx";

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
const ACCEPTED_EXT = [".doc", ".docx"];
const LICENSE_EXT = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];

function sanitize(name) {
    return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

async function saveUpload(file, acceptedExt = ACCEPTED_EXT) {
    if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) return null;
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!acceptedExt.includes(ext)) {
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

    const { emailIsRegistered } = await import("../data/papers.server");

    // Lightweight step-1 check fired from the "Continue" button: the author's
    // email must belong to a registered conference participant.
    if (formData.get("intent") === "check-email") {
        const email = formData.get("email");
        const registered = await emailIsRegistered(email);
        return {
            emailValid: registered,
            message: registered
                ? null
                : "This email is not registered for WRT2026. Please complete conference registration and send abstracts first.",
        };
    }

    // Public status lookup: list every manuscript submitted under an email.
    if (formData.get("intent") === "check-status") {
        const email = formData.get("email");
        const { papersByEmail } = await import("../data/papers.server");
        const papers = await papersByEmail(email);
        return { statusEmail: (email || "").trim(), statusResults: papers };
    }

    // Server-side validation mirrors the client steps.
    const errors = {};
    const author = formData.get("author");
    const email = formData.get("email");
    const title = formData.get("abstract_title");
    const paper = formData.get("paper");
    const license = formData.get("license");

    if (!author?.trim()) errors.author = "Author name is required.";
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "A valid email is required.";
    else if (!(await emailIsRegistered(email))) errors.email = "This email is not registered for WRT2026. Please complete conference registration first.";
    if (!title?.trim()) errors.abstract_title = "Paper title is required.";
    if (!paper || typeof paper.arrayBuffer !== "function" || paper.size === 0) {
        errors.paper = "Please attach your manuscript.";
    }
    if (!license || typeof license.arrayBuffer !== "function" || license.size === 0) {
        errors.license = "Please attach your signed license agreement.";
    }
    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    let savedPaper;
    let savedLicense;
    let savedSupplementary = null;
    try {
        savedPaper = await saveUpload(paper);
        savedLicense = await saveUpload(license, LICENSE_EXT);
        const supplementary = formData.get("supplementary");
        savedSupplementary = await saveUpload(supplementary);
    } catch (error) {
        console.log("Paper upload error:", error);
        return { errors: { paper: error.message } };
    }

    let record;
    try {
        const { savePaper } = await import("../data/papers.server");
        record = await savePaper({
            author,
            email,
            co_authors: formData.get("co_authors") || "",
            organization: formData.get("institutions") || "",
            paper_title: title,
            filename: savedPaper.filename,
            license_filename: savedLicense.filename,
        });
        console.log("Saved paper submission:", record.id, record.manuscript_link);
    } catch (error) {
        console.log("Paper DB save error:", error);
        return { errors: { paper: "We saved your file but couldn't record the submission. Please contact the office." } };
    }

    // Notify the conference addresses. The paper is already saved, so a mail
    // failure must not fail the submission — just log it.
    try {
        const { sendPaperUploadEmail } = await import("../data/email.server");
        await sendPaperUploadEmail({
            author,
            email,
            co_authors: formData.get("co_authors") || "",
            organization: formData.get("institutions") || "",
            paper_title: title,
            status: record.status,
            manuscript_link: record.manuscript_link,
            license_link: record.license_link,
        });
    } catch (error) {
        console.log("Paper upload notification error:", error);
    }

    return { success: true };
}

export default function PaperUploadRoute() {
    return (
        <>
            <PaperUpload />
            <PaperStatusChecker />
        </>
    );
}