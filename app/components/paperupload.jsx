import { Form, useActionData, useFetcher, useNavigation, useSubmit } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
const STEPS = [
    { id: "authors", title: "Authors", subtitle: "Who is submitting" },
    { id: "paper", title: "Paper", subtitle: "Title & manuscript" },
    { id: "review", title: "Review", subtitle: "Confirm & submit" },
];

const MAX_FILE_MB = 25;
const MAX_PAGES = 6;
const ACCEPTED = [".doc", ".docx"];
const LICENSE_ACCEPTED = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];

// Human-readable labels for error keys, used in the failure toast.
const FIELD_LABELS = {
    author: "Author name",
    email: "Email",
    co_authors: "Co-authors",
    institutions: "Affiliations",
    abstract_title: "Paper title",
    keywords: "Keywords",
    paper: "Manuscript file",
    license: "Signed license agreement",
    supplementary: "Supplementary file",
    confirm: "Confirmation",
};

const EMPTY = {
    author: "",
    email: "",
    co_authors: "",
    institutions: "",
    abstract_title: "",
    keywords: "",
};

function fileIsValid(file, accepted = ACCEPTED, label = "manuscript") {
    if (!file) return `Please attach your ${label} file.`;
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!accepted.includes(ext)) return `Unsupported file type. Allowed: ${accepted.join(", ")}`;
    if (file.size > MAX_FILE_MB * 1024 * 1024) return `File is too large (max ${MAX_FILE_MB} MB).`;
    return null;
}

function humanSize(bytes) {
    if (!bytes) return "";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
        n /= 1024;
        i++;
    }
    return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

// A .docx is a ZIP archive; Word caches the page count of the last save in
// docProps/app.xml as <Pages>N</Pages>. We read that value without any library
// by walking the ZIP central directory and inflating just that one entry with
// the browser's built-in DecompressionStream.
//
// NOTE: this is an ESTIMATE — it's whatever app last saved the file computed,
// and may be missing/stale for files not authored in Word (Google Docs export,
// python-docx, some LibreOffice saves). Returns null when it can't be
// determined (not a .docx, no cached value, or an unsupported browser).
async function getDocxPageCount(file) {
    try {
        if (typeof DecompressionStream === "undefined") return null;
        const buf = new Uint8Array(await file.arrayBuffer());
        const view = new DataView(buf.buffer);

        // Locate the End Of Central Directory record (scan backwards; the ZIP
        // comment can be up to 65535 bytes, so cap the search there).
        let eocd = -1;
        const minEocd = Math.max(0, buf.length - 22 - 65535);
        for (let i = buf.length - 22; i >= minEocd; i--) {
            if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
        }
        if (eocd < 0) return null;

        const cdOffset = view.getUint32(eocd + 16, true);
        const cdCount = view.getUint16(eocd + 10, true);
        const decoder = new TextDecoder();

        // Walk the central directory looking for docProps/app.xml.
        let p = cdOffset;
        let localOffset = null, method = null, compSize = null;
        for (let n = 0; n < cdCount; n++) {
            if (view.getUint32(p, true) !== 0x02014b50) break;
            const nameLen = view.getUint16(p + 28, true);
            const extraLen = view.getUint16(p + 30, true);
            const commentLen = view.getUint16(p + 32, true);
            const name = decoder.decode(buf.subarray(p + 46, p + 46 + nameLen));
            if (name === "docProps/app.xml") {
                method = view.getUint16(p + 10, true);
                compSize = view.getUint32(p + 20, true);
                localOffset = view.getUint32(p + 42, true);
                break;
            }
            p += 46 + nameLen + extraLen + commentLen;
        }
        if (localOffset === null) return null;

        // The local header's name/extra lengths can differ from the central
        // directory's, so read them here to find where the data begins.
        if (view.getUint32(localOffset, true) !== 0x04034b50) return null;
        const lNameLen = view.getUint16(localOffset + 26, true);
        const lExtraLen = view.getUint16(localOffset + 28, true);
        const dataStart = localOffset + 30 + lNameLen + lExtraLen;
        const compData = buf.subarray(dataStart, dataStart + compSize);

        let xmlBytes;
        if (method === 0) {
            xmlBytes = compData; // stored, no compression
        } else if (method === 8) {
            const stream = new Blob([compData]).stream()
                .pipeThrough(new DecompressionStream("deflate-raw"));
            xmlBytes = new Uint8Array(await new Response(stream).arrayBuffer());
        } else {
            return null;
        }

        const match = decoder.decode(xmlBytes).match(/<Pages>(\d+)<\/Pages>/);
        if (!match) return null;
        const pages = parseInt(match[1], 10);
        return Number.isFinite(pages) && pages > 0 ? pages : null;
    } catch {
        return null;
    }
}

export default function PaperUpload() {
    const data = useActionData();
    const navigation = useNavigation();
    const submit = useSubmit();
    const emailCheck = useFetcher();
    const isSubmitting = navigation.state !== "idle";
    const isCheckingEmail = emailCheck.state !== "idle";

    const [step, setStep] = useState(0);
    const [values, setValues] = useState(EMPTY);
    const [paperFile, setPaperFile] = useState(null);
    const [paperPages, setPaperPages] = useState(null);
    const [licenseFile, setLicenseFile] = useState(null);
    const [supplementaryFile, setSupplementaryFile] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const [errors, setErrors] = useState({});
    const [dragging, setDragging] = useState(false);
    const [licenseDragging, setLicenseDragging] = useState(false);

    const formRef = useRef();
    const paperInputRef = useRef();
    const licenseInputRef = useRef();
    const suppInputRef = useRef();
    const awaitingCheck = useRef(false);

    const update = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

    // Reset on successful submission.
    useEffect(() => {
        if (data?.success) {
            toast.success("Your paper was submitted successfully. Thank you!");
            formRef.current?.reset();
            setValues(EMPTY);
            setPaperFile(null);
            setPaperPages(null);
            setLicenseFile(null);
            setSupplementaryFile(null);
            setConfirmed(false);
            setErrors({});
            setStep(0);
        } else if (data?.errors) {
            const fields = Object.keys(data.errors)
                .map((key) => FIELD_LABELS[key] || key)
                .join(", ");
            (data?.errors?.paper ? console.log(data.errors.paper) : console.log(data.error))
            toast.error(
                fields
                    ? `We couldn't submit your paper. Please review: ${fields}.`
                    : "We couldn't submit your paper. Please review the highlighted fields."
            );
            setErrors(data.errors);
        }
    }, [data]);

    // Estimate the manuscript's page count from the .docx metadata whenever the
    // selected file changes. Only .docx exposes a cached count; anything else
    // (or an unreadable file) leaves paperPages null and the check is skipped.
    useEffect(() => {
        let cancelled = false;
        if (!paperFile || !paperFile.name.toLowerCase().endsWith(".docx")) {
            setPaperPages(null);
            return;
        }
        getDocxPageCount(paperFile).then((pages) => {
            if (!cancelled) setPaperPages(pages);
        });
        return () => { cancelled = true; };
    }, [paperFile]);

    function validateStep(current) {
        const e = {};
        if (current === 0) {
            if (!values.author.trim()) e.author = "Author name is required.";
            if (!values.email.trim()) e.email = "Email is required.";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = "Enter a valid email address.";
            if (!values.institutions.trim()) e.institutions = "Organization is required.";
        }
        if (current === 1) {
            if (!values.abstract_title.trim()) e.abstract_title = "Paper title is required.";
            const fileError = fileIsValid(paperFile);
            if (fileError) e.paper = fileError;
            const licenseError = fileIsValid(licenseFile, LICENSE_ACCEPTED, "signed license agreement");
            if (licenseError) e.license = licenseError;
            if (supplementaryFile) {
                const supErr = fileIsValid(supplementaryFile);
                if (supErr) e.supplementary = supErr;
            }
        }
        if (current === 2) {
            if (!confirmed) e.confirm = "Please confirm the information is correct.";
        }
        setErrors(e);
        Object.values(e).forEach((msg) => toast.error(msg));
        return Object.keys(e).length === 0;
    }

    // After step 0, only advance once the server confirms the author email
    // belongs to a registered participant.
    useEffect(() => {
        if (!awaitingCheck.current || isCheckingEmail || !emailCheck.data) return;
        awaitingCheck.current = false;
        if (emailCheck.data.emailValid) {
            setStep(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            setErrors((prev) => ({ ...prev, email: emailCheck.data.message }));
            toast.error(emailCheck.data.message);
        }
    }, [isCheckingEmail, emailCheck.data]);

    function next() {
        if (!validateStep(step)) return;
        if (step === 0) {
            awaitingCheck.current = true;
            emailCheck.submit(
                { intent: "check-email", email: values.email },
                { method: "post" }
            );
            return;
        }
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function back() {
        setErrors({});
        setStep((s) => Math.max(s - 1, 0));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setPaperFile(file);
            // Mirror the drop into the real input so it's part of the form submission.
            if (paperInputRef.current) {
                paperInputRef.current.files = e.dataTransfer.files;
            }
            setErrors((prev) => ({ ...prev, paper: fileIsValid(file) || undefined }));
        }
    }

    function handleLicenseDrop(e) {
        e.preventDefault();
        setLicenseDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setLicenseFile(file);
            if (licenseInputRef.current) {
                licenseInputRef.current.files = e.dataTransfer.files;
            }
            setErrors((prev) => ({ ...prev, license: fileIsValid(file, LICENSE_ACCEPTED, "signed license agreement") || undefined }));
        }
    }

    const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

    // Submit programmatically so the actual File objects from state are sent,
    // independent of the hidden file input (which the drag-drop path can't
    // reliably populate across browsers).
    function handleSubmit(e) {
        e.preventDefault();
        if (step !== STEPS.length - 1) return;
        if (!validateStep(STEPS.length - 1)) return;

        const fileError = fileIsValid(paperFile);
        if (fileError) {
            setErrors((prev) => ({ ...prev, paper: fileError }));
            toast.error(fileError);
            return;
        }

        const licenseError = fileIsValid(licenseFile, LICENSE_ACCEPTED, "signed license agreement");
        if (licenseError) {
            setErrors((prev) => ({ ...prev, license: licenseError }));
            toast.error(licenseError);
            return;
        }

        const fd = new FormData();
        fd.set("author", values.author);
        fd.set("email", values.email);
        fd.set("co_authors", values.co_authors);
        fd.set("institutions", values.institutions);
        fd.set("abstract_title", values.abstract_title);
        fd.set("keywords", values.keywords);
        fd.set("paper", paperFile);
        fd.set("license", licenseFile);
        if (supplementaryFile) fd.set("supplementary", supplementaryFile);

        submit(fd, { method: "post", encType: "multipart/form-data" });
    }

    return (
        <section id="paper-upload" className="contact-section pt-150 pb-100 pt-md-200">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-10 col-xl-11 col-lg-12">
                        <div className="section-title text-center mb-40">
                            <h3>Paper Submission</h3>
                            <p>Upload your full paper for WRT2026 in a few quick steps</p>
                        </div>

                        {/* Required documents to download before submitting */}
                        <div className="pu-downloads">
                            <p className="pu-downloads__text">
                                Before you start, please download the two documents below. Prepare your
                                manuscript using the <strong>Paper Template</strong>, sign the{" "}
                                <strong>Publication License Agreement</strong>, and upload both files in{" "}
                                <strong>Step 2 (Paper)</strong>.
                            </p>
                            <div className="pu-downloads__actions">
                                <a
                                    className="main-btn btn-hover pu-download-btn"
                                    href="https://wrt2026.com.ua/MRF-PubLicenseAgreement.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                >
                                    ⬇ License Agreement (PDF)
                                </a>
                                <a
                                    className="main-btn btn-hover pu-download-btn"
                                    href="https://wrt2026.com.ua/Paper_template_2026.docx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                >
                                    ⬇ Paper Template (DOCX)
                                </a>
                            </div>
                        </div>

                        {/* Stepper */}
                        <div className="pu-stepper">
                            {STEPS.map((s, i) => {
                                const state = i < step ? "done" : i === step ? "active" : "todo";
                                return (
                                    <div key={s.id} className={`pu-step pu-step--${state}`}>
                                        <div className="pu-step__dot">{i < step ? "✓" : i + 1}</div>
                                        <div className="pu-step__label">
                                            <span className="pu-step__title">{s.title}</span>
                                            <span className="pu-step__subtitle">{s.subtitle}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="pu-progress">
                            <span className="pu-progress__bar" style={{ width: `${progress}%` }} />
                        </div>

                        <div className="contact-form-wrapper mt-40">
                            <Form
                                method="post"
                                encType="multipart/form-data"
                                className="contact-form"
                                ref={formRef}
                                onSubmit={handleSubmit}
                            >
                                {/* STEP 1 — Authors */}
                                <fieldset className="pu-panel" hidden={step !== 0}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="single-form">
                                                <input type="text" className="form-input" name="author"
                                                       placeholder="Corresponding Author Name"
                                                       value={values.author} onChange={update("author")} />
                                                {errors.author && <p className="pu-error">{errors.author}</p>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="single-form">
                                                <input type="email" className="form-input" name="email"
                                                       placeholder="Author Email"
                                                       value={values.email} onChange={update("email")} />
                                                {errors.email && <p className="pu-error">{errors.email}</p>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="single-form">
                                                <input type="text" className="form-input" name="co_authors"
                                                       placeholder="Co-Authors (comma separated, optional)"
                                                       value={values.co_authors} onChange={update("co_authors")} />
                                                {errors.co_authors && <p className="pu-error">{errors.co_authors}</p>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="single-form">
                                                <input type="text" className="form-input" name="institutions"
                                                       placeholder="Organizations / Affiliations"
                                                       value={values.institutions} onChange={update("institutions")} />
                                                {errors.institutions && <p className="pu-error">{errors.institutions}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* STEP 2 — Paper & manuscript */}
                                <fieldset className="pu-panel" hidden={step !== 1}>
                                    <div className="row">
                                        <div className="col-md-7">
                                            <div className="single-form">
                                                <input type="text" className="form-input" name="abstract_title"
                                                       placeholder="Paper Title"
                                                       value={values.abstract_title} onChange={update("abstract_title")} />
                                                {errors.abstract_title && <p className="pu-error">{errors.abstract_title}</p>}
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="single-form">
                                                <input type="text" className="form-input" name="keywords"
                                                       placeholder="Keywords (comma separated)"
                                                       value={values.keywords} onChange={update("keywords")} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div
                                                className={`pu-dropzone${dragging ? " pu-dropzone--active" : ""}${paperFile ? " pu-dropzone--filled" : ""}`}
                                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                                onDragLeave={() => setDragging(false)}
                                                onDrop={handleDrop}
                                                onClick={() => paperInputRef.current?.click()}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <input
                                                    ref={paperInputRef}
                                                    type="file"
                                                    name="paper"
                                                    accept={ACCEPTED.join(",")}
                                                    className="pu-file-hidden"
                                                    onChange={(e) => {
                                                        const f = e.target.files?.[0] || null;
                                                        setPaperFile(f);
                                                        setErrors((prev) => ({ ...prev, paper: f ? (fileIsValid(f) || undefined) : undefined }));
                                                    }}
                                                />
                                                {paperFile ? (
                                                    <div className="pu-file-card">
                                                        <span className="pu-file-icon">📄</span>
                                                        <div className="pu-file-meta">
                                                            <strong>{paperFile.name}</strong>
                                                            <span>
                                                                {humanSize(paperFile.size)}
                                                                {paperPages ? ` · ~${paperPages} page${paperPages > 1 ? "s" : ""}` : ""}
                                                            </span>
                                                        </div>
                                                        <button type="button" className="pu-file-remove"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setPaperFile(null);
                                                                    if (paperInputRef.current) paperInputRef.current.value = "";
                                                                }}>
                                                            Remove
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="pu-dropzone__hint">
                                                        <span className="pu-dropzone__icon">⬆</span>
                                                        <strong>Drag &amp; drop your manuscript</strong>
                                                        <span>or click to browse — {ACCEPTED.join(", ")} up to {MAX_FILE_MB} MB</span>
                                                        <span>Manuscript shouldn't exceed 6 pages</span>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.paper && <p className="pu-error">{errors.paper}</p>}
                                            {paperPages > MAX_PAGES && (
                                                <p className="pu-warning">
                                                    ⚠ This document appears to be ~{paperPages} pages. The limit is {MAX_PAGES} pages —
                                                    please shorten your manuscript. (Page count is estimated from the file and may vary.)
                                                </p>
                                            )}
                                        </div>

                                        <div className="col-md-12">
                                            <label className="pu-supp__label pu-supp__label--spaced">Signed License Agreement (required)</label>
                                            <div
                                                className={`pu-dropzone${licenseDragging ? " pu-dropzone--active" : ""}${licenseFile ? " pu-dropzone--filled" : ""}`}
                                                onDragOver={(e) => { e.preventDefault(); setLicenseDragging(true); }}
                                                onDragLeave={() => setLicenseDragging(false)}
                                                onDrop={handleLicenseDrop}
                                                onClick={() => licenseInputRef.current?.click()}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <input
                                                    ref={licenseInputRef}
                                                    type="file"
                                                    name="license"
                                                    accept={LICENSE_ACCEPTED.join(",")}
                                                    className="pu-file-hidden"
                                                    onChange={(e) => {
                                                        const f = e.target.files?.[0] || null;
                                                        setLicenseFile(f);
                                                        setErrors((prev) => ({ ...prev, license: f ? (fileIsValid(f, LICENSE_ACCEPTED, "signed license agreement") || undefined) : undefined }));
                                                    }}
                                                />
                                                {licenseFile ? (
                                                    <div className="pu-file-card">
                                                        <span className="pu-file-icon">📝</span>
                                                        <div className="pu-file-meta">
                                                            <strong>{licenseFile.name}</strong>
                                                            <span>{humanSize(licenseFile.size)}</span>
                                                        </div>
                                                        <button type="button" className="pu-file-remove"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setLicenseFile(null);
                                                                    if (licenseInputRef.current) licenseInputRef.current.value = "";
                                                                }}>
                                                            Remove
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="pu-dropzone__hint">
                                                        <span className="pu-dropzone__icon">⬆</span>
                                                        <strong>Drag &amp; drop your signed license agreement</strong>
                                                        <span>or click to browse — {LICENSE_ACCEPTED.join(", ")} up to {MAX_FILE_MB} MB</span>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.license && <p className="pu-error">{errors.license}</p>}
                                        </div>

                                        <div className="col-md-12">
                                            <div className="single-form pu-supp">
                                                <label className="pu-supp__label">Supplementary file (optional)</label>
                                                <input
                                                    ref={suppInputRef}
                                                    type="file"
                                                    name="supplementary"
                                                    className="form-input"
                                                    onChange={(e) => {
                                                        const f = e.target.files?.[0] || null;
                                                        setSupplementaryFile(f);
                                                        setErrors((prev) => ({ ...prev, supplementary: f ? (fileIsValid(f) || undefined) : undefined }));
                                                    }}
                                                />
                                                {errors.supplementary && <p className="pu-error">{errors.supplementary}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* STEP 3 — Review */}
                                <fieldset className="pu-panel" hidden={step !== 2}>
                                    <div className="pu-review">
                                        <Row label="Corresponding author" value={values.author} />
                                        <Row label="Email" value={values.email} />
                                        <Row label="Co-authors" value={values.co_authors || "—"} />
                                        <Row label="Affiliations" value={values.institutions || "—"} />
                                        <Row label="Title" value={values.abstract_title} />
                                        <Row label="Keywords" value={values.keywords || "—"} />
                                        <Row label="Manuscript" value={paperFile ? `${paperFile.name} (${humanSize(paperFile.size)}${paperPages ? `, ~${paperPages} pages` : ""})` : "—"} />
                                        <Row label="Signed license" value={licenseFile ? `${licenseFile.name} (${humanSize(licenseFile.size)})` : "—"} />
                                        <Row label="Supplementary" value={supplementaryFile ? supplementaryFile.name : "—"} />
                                    </div>

                                    <div className="single-form mt-20">
                                        <label className="pu-confirm">
                                            <input type="checkbox" checked={confirmed}
                                                   onChange={(e) => setConfirmed(e.target.checked)} />
                                            <span>I confirm the information above is correct and the manuscript is my original work.</span>
                                        </label>
                                        {errors.confirm && <p className="pu-error">{errors.confirm}</p>}
                                    </div>
                                </fieldset>

                                {/* Navigation */}
                                <div className="pu-nav">
                                    {step > 0 ? (
                                        <button type="button" className="main-btn btn-hover pu-btn--ghost" onClick={back} disabled={isSubmitting}>
                                            Back
                                        </button>
                                    ) : <span />}

                                    {step < STEPS.length - 1 ? (
                                        <button type="button" className={isCheckingEmail ? "main-btn btn-hover loading" : "main-btn btn-hover"} onClick={next} disabled={isCheckingEmail}>
                                            {step === 0 && isCheckingEmail ? "Checking email…" : "Continue"}
                                        </button>
                                    ) : (
                                        <button type="submit" className={isSubmitting ? "main-btn btn-hover loading" : "main-btn btn-hover"} disabled={isSubmitting}>
                                            {isSubmitting ? "Submitting…" : "Submit Paper"}
                                        </button>
                                    )}
                                </div>
                            </Form>

                            {data?.success && (
                                <div className="return-wrapper">
                                    <p style={{ color: "green" }}>Thank you! Your paper has been received.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{paperUploadStyles}</style>
        </section>
    );
}

function Row({ label, value }) {
    return (
        <div className="pu-review__row">
            <span className="pu-review__label">{label}</span>
            <span className="pu-review__value">{value}</span>
        </div>
    );
}

const paperUploadStyles = `
.pu-downloads { background:#fbfcfe; border:1px solid #eef1f6; border-radius:14px; padding:22px 24px; margin-bottom:30px; }
.pu-downloads__text { color:#374151; font-size:15px; line-height:1.6; margin:0 0 18px; }
.pu-downloads__text strong { color:#1f2937; }
.pu-downloads__actions { display:flex; gap:14px; flex-wrap:wrap; }
.pu-download-btn { display:inline-flex; align-items:center; gap:8px; }
@media (max-width:575px){ .pu-downloads__actions{ flex-direction:column; } .pu-download-btn{ width:100%; justify-content:center; } }
.pu-stepper { display:flex; gap:12px; justify-content:space-between; flex-wrap:wrap; }
.pu-step { display:flex; align-items:center; gap:12px; flex:1 1 180px; min-width:160px; }
.pu-step__dot { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; background:#eef1f6; color:#8a94a6; flex-shrink:0; transition:all .25s; }
.pu-step--active .pu-step__dot { background:#1c63ff; color:#fff; box-shadow:0 0 0 4px rgba(28,99,255,.18); }
.pu-step--done .pu-step__dot { background:#16a34a; color:#fff; }
.pu-step__label { display:flex; flex-direction:column; line-height:1.2; }
.pu-step__title { font-weight:600; color:#fff; font-size:15px; }
.pu-step__subtitle { font-size:12px; color:#9aa3b2; }
.pu-progress { height:6px; background:#eef1f6; border-radius:99px; margin-top:22px; overflow:hidden; }
.pu-progress__bar { display:block; height:100%; background:linear-gradient(90deg,#1c63ff,#16a34a); transition:width .3s ease; }
.pu-panel { border:0; padding:0; margin:0; min-inline-size:auto; }
.pu-error { color:#dc2626; font-size:13px; margin-top:6px; }
.pu-warning { color:#b45309; background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:10px 14px; font-size:13px; line-height:1.5; margin-top:10px; }
.pu-counter { font-size:13px; color:#9aa3b2; margin-top:6px; }
.pu-dropzone { border:2px dashed #c7d0de; border-radius:14px; padding:46px 20px; text-align:center; cursor:pointer; transition:all .2s; background:#fbfcfe; }
.pu-dropzone:hover, .pu-dropzone--active { border-color:#1c63ff; background:#f3f7ff; }
.pu-dropzone--filled { border-style:solid; border-color:#16a34a; background:#f3fbf5; }
.pu-dropzone__hint { display:flex; flex-direction:column; gap:6px; color:#6b7280; }
.pu-dropzone__hint strong { color:#1f2937; font-size:17px; }
.pu-dropzone__icon { font-size:30px; }
.pu-file-hidden { display:none; }
.pu-file-card { display:flex; align-items:center; gap:14px; text-align:left; }
.pu-file-icon { font-size:30px; }
.pu-file-meta { display:flex; flex-direction:column; flex:1; }
.pu-file-meta strong { color:#1f2937; word-break:break-all; }
.pu-file-meta span { font-size:13px; color:#9aa3b2; }
.pu-file-remove { background:#fee2e2; color:#dc2626; border:0; border-radius:8px; padding:8px 14px; font-weight:600; cursor:pointer; }
.pu-supp { margin-top:24px; }
.pu-supp__label { display:block; margin-bottom:8px; font-weight:600; color:#fff; }
.pu-supp__label--spaced { margin-top:24px; }
.pu-review { background:#fbfcfe; border:1px solid #eef1f6; border-radius:14px; padding:10px 22px; }
.pu-review__row { display:flex; gap:16px; padding:12px 0; border-bottom:1px solid #eef1f6; }
.pu-review__label { flex:0 0 180px; color:#9aa3b2; font-size:13px; text-transform:uppercase; letter-spacing:.03em; }
.pu-review__value { color:#1f2937; font-weight:500; word-break:break-word; }
.pu-review__abstract { padding:14px 0; }
.pu-review__abstract p { margin-top:6px; white-space:pre-wrap; color:#374151; }
.pu-confirm { display:flex; gap:10px; align-items:flex-start; cursor:pointer; }
.pu-confirm input { margin-top:4px; }
form.contact-form .pu-panel .pu-confirm input { width: auto; margin-top:0; }
.pu-nav { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-top:34px; }
.pu-btn--ghost { background:#eef1f6 !important; color:#374151 !important; }
@media (max-width:575px){ .pu-review__row{ flex-direction:column; gap:2px; } .pu-review__label{ flex:none; } }
`;