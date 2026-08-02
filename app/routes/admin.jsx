import { useMemo, useState } from "react";
import { Form, useLoaderData, useActionData, useNavigation, useFetcher } from "react-router";

// ?url hands the file to Vite so it gets hashed and emitted into the build —
// assets/ isn't under public/, so a raw href would 404.
import adminStylesHref from "../../assets/css/admin.css?url";
import { PAPER_STATUSES, isValidPaperStatus, statusTone } from "../data/paper-status.js";

export const links = () => [
    { rel: "stylesheet", href: adminStylesHref },
];


export function meta() {
    return [
        { title: "Admin - WRT2026 Conference" },
        { name: "robots", content: "noindex, nofollow" },
    ];
}

export async function loader({ request }) {
    const { getAdminFromSession, listPapers } = await import("../data/admin.server");

    const admin = await getAdminFromSession(request);
    if (!admin) return { admin: null, papers: [] };

    return { admin, papers: await listPapers() };
}

export async function action({ request }) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    const {
        verifyAdminLogin,
        createAdminSession,
        logoutAdmin,
        requireAdmin,
        deletePaper,
        updatePaperStatus,
        updatePaperNotes,
    } = await import("../data/admin.server");

    if (intent === "logout") {
        return logoutAdmin(request);
    }

    if (intent === "update-notes") {
        await requireAdmin(request);

        const paperId = Number(formData.get("paperId"));
        if (!Number.isInteger(paperId) || paperId <= 0) {
            return { error: "Invalid paper id." };
        }

        const updated = await updatePaperNotes(paperId, formData.get("notes"));
        return updated ? { notesSavedId: updated.id } : { error: "That paper no longer exists." };
    }

    if (intent === "update-status") {
        await requireAdmin(request);

        const paperId = Number(formData.get("paperId"));
        const status = formData.get("status");
        if (!Number.isInteger(paperId) || paperId <= 0) {
            return { error: "Invalid paper id." };
        }
        if (!isValidPaperStatus(status)) {
            return { error: "Unknown status." };
        }

        const updated = await updatePaperStatus(paperId, status);
        if (!updated) {
            return { error: "That paper no longer exists." };
        }
        if (!updated.changed) {
            return { updatedId: updated.id };
        }

        // The new status is already saved. A mail failure must not undo it —
        // report it back so the admin knows the author wasn't told.
        try {
            const { sendPaperStatusEmail } = await import("../data/email.server");
            await sendPaperStatusEmail(updated);
        } catch (error) {
            console.log("Paper status email error:", error);
            return { updatedId: updated.id, emailFailed: true };
        }

        return { updatedId: updated.id };
    }

    if (intent === "delete") {
        // Throws a redirect to the login form if the session isn't an admin, so
        // a hand-crafted POST can't delete anything.
        await requireAdmin(request);

        const paperId = Number(formData.get("paperId"));
        if (!Number.isInteger(paperId) || paperId <= 0) {
            return { error: "Invalid paper id." };
        }

        const deleted = await deletePaper(paperId);
        return deleted ? { deletedId: paperId } : { error: "That paper no longer exists." };
    }

    const email = formData.get("email");
    const password = formData.get("password");

    if (!email?.trim() || !password) {
        return { error: "Please enter your email and password." };
    }

    const admin = await verifyAdminLogin(email, password);
    if (!admin) {
        // Deliberately vague: don't reveal which admin emails exist.
        return { error: "Invalid email or password." };
    }

    return createAdminSession(admin.id);
}

function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminRoute() {
    const { admin, papers } = useLoaderData();

    return admin ? <PapersDashboard admin={admin} papers={papers} /> : <AdminLogin />;
}

function AdminLogin() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <section className="contact-section pt-100 pb-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-9">
                        <div className="section-title text-center mb-50">
                            <h3>Admin Login</h3>
                            <p>Sign in to review submitted manuscripts</p>
                        </div>

                        <div className="contact-form-wrapper admin-login-wrapper">
                            <Form method="post" className="contact-form">
                                <div className="single-form">
                                    <input
                                        type="email"
                                        className="form-input"
                                        name="email"
                                        placeholder="Email"
                                        autoComplete="username"
                                        required
                                    />
                                </div>
                                <div className="single-form">
                                    <input
                                        type="password"
                                        className="form-input"
                                        name="password"
                                        placeholder="Password"
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>

                                {actionData?.error && <p className="admin-error">{actionData.error}</p>}

                                <div className="submit-btn">
                                    <button
                                        type="submit"
                                        className={isSubmitting ? "main-btn btn-hover loading" : "main-btn btn-hover"}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Signing in…" : "Sign in"}
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PapersDashboard({ admin, papers }) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return papers;
        return papers.filter((p) =>
            [p.paper_title, p.author, p.email, p.co_authors, p.organization, p.status, p.notes]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(q))
        );
    }, [papers, query]);

    return (
        <section className="admin-section pt-150 pb-100">
            <div className="container">
                <div className="admin-bar">
                    <div>
                        <h3 className="admin-bar__title">Uploaded Papers</h3>
                        <p className="admin-bar__meta">
                            {papers.length} submission{papers.length === 1 ? "" : "s"} · signed in as{" "}
                            <strong>{admin.email}</strong>
                        </p>
                    </div>
                    <Form method="post">
                        <input type="hidden" name="intent" value="logout" />
                        <button type="submit" className="admin-logout">
                            Log out
                        </button>
                    </Form>
                </div>

                {papers.length > 0 && (
                    <input
                        type="search"
                        className="admin-search"
                        placeholder="Filter by title, author, email, organization or status…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                )}

                {papers.length === 0 ? (
                    <p className="admin-empty">No papers have been submitted yet.</p>
                ) : filtered.length === 0 ? (
                    <p className="admin-empty">
                        No papers match <strong>{query}</strong>.
                    </p>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Paper title</th>
                                    <th>Author</th>
                                    <th>Organization</th>
                                    <th>Status</th>
                                    <th>Notes / corrections</th>
                                    <th>Submitted</th>
                                    <th>Files</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((paper) => (
                                    <tr key={paper.id}>
                                        <td className="admin-td-id">{paper.id}</td>
                                        <td>
                                            <span className="admin-title">{paper.paper_title}</span>
                                            {paper.co_authors && (
                                                <span className="admin-subtle">Co-authors: {paper.co_authors}</span>
                                            )}
                                        </td>
                                        <td>
                                            <span>{paper.author}</span>
                                            <a className="admin-subtle admin-link" href={`mailto:${paper.email}`}>
                                                {paper.email}
                                            </a>
                                        </td>
                                        <td className="admin-td-org">{paper.organization || "—"}</td>
                                        <td className="admin-td-status">
                                            <StatusSelect paper={paper} />
                                        </td>
                                        <td className="admin-td-notes">
                                            <NotesCell paper={paper} />
                                        </td>
                                        <td className="admin-td-date">{formatDate(paper.createdAt)}</td>
                                        <td className="admin-td-files">
                                            <a href={paper.manuscript_link} target="_blank" rel="noreferrer">
                                                Manuscript
                                            </a>
                                            {paper.license_link && (
                                                <a href={paper.license_link} target="_blank" rel="noreferrer">
                                                    License
                                                </a>
                                            )}
                                        </td>
                                        <td className="admin-td-actions">
                                            <DeletePaperButton paper={paper} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}

// Mirrors MAX_NOTES_LENGTH in admin.server.js, which is what actually enforces it.
const MAX_NOTES_LENGTH = 10000;

// Unlike the status dropdown this doesn't save on every keystroke — the Save
// button appears once the box differs from what's stored.
function NotesCell({ paper }) {
    const fetcher = useFetcher();
    const saved = paper.notes ?? "";
    const [value, setValue] = useState(saved);

    const isSaving = fetcher.state !== "idle";
    const dirty = value !== saved;

    return (
        <fetcher.Form method="post" className="admin-notes-form">
            <input type="hidden" name="intent" value="update-notes" />
            <input type="hidden" name="paperId" value={paper.id} />
            <textarea
                name="notes"
                className="admin-notes"
                rows={3}
                maxLength={MAX_NOTES_LENGTH}
                placeholder="Notes or requested corrections…"
                aria-label={`Notes for "${paper.paper_title}"`}
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
            <div className="admin-notes__foot">
                {dirty ? (
                    <>
                        <button type="submit" className="admin-notes-save" disabled={isSaving}>
                            {isSaving ? "Saving…" : "Save"}
                        </button>
                        <button
                            type="button"
                            className="admin-cancel"
                            onClick={() => setValue(saved)}
                            disabled={isSaving}
                        >
                            Revert
                        </button>
                    </>
                ) : (
                    fetcher.data?.notesSavedId === paper.id && (
                        <span className="admin-notes-saved">Saved</span>
                    )
                )}
            </div>
            {fetcher.data?.error && <p className="admin-row-error">{fetcher.data.error}</p>}
        </fetcher.Form>
    );
}

// Saves the moment the admin picks a value — there's no separate save button.
function StatusSelect({ paper }) {
    const fetcher = useFetcher();
    const isSaving = fetcher.state !== "idle";

    // While the request is in flight the loader still reports the old status, so
    // read the pending value off the fetcher to keep the select from snapping
    // back and forth.
    const value = fetcher.formData?.get("status") ?? paper.status;

    // A row written before this list existed would otherwise silently display
    // the first option instead of what's actually stored.
    const options = isValidPaperStatus(value) ? PAPER_STATUSES : [value, ...PAPER_STATUSES];

    return (
        <fetcher.Form method="post" className="admin-status-form">
            <input type="hidden" name="intent" value="update-status" />
            <input type="hidden" name="paperId" value={paper.id} />
            <select
                name="status"
                aria-label={`Status for "${paper.paper_title}"`}
                className={`admin-status-select admin-status-select--${statusTone(value)}`}
                value={value}
                disabled={isSaving}
                onChange={(event) => fetcher.submit(event.currentTarget.form, { method: "post" })}
            >
                {options.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
            {isSaving && <span className="admin-status-saving">Saving…</span>}
            {fetcher.data?.error && <p className="admin-row-error">{fetcher.data.error}</p>}
            {fetcher.data?.emailFailed && (
                <p className="admin-row-warning">Status saved, but the author could not be emailed.</p>
            )}
        </fetcher.Form>
    );
}

// Deleting is irreversible, so the button arms itself first and only the second
// click submits. Each row gets its own fetcher, so one delete never blocks the
// rest of the table.
function DeletePaperButton({ paper }) {
    const fetcher = useFetcher();
    const [confirming, setConfirming] = useState(false);

    if (fetcher.state !== "idle") {
        return <span className="admin-deleting">Deleting…</span>;
    }

    if (!confirming) {
        return (
            <>
                <button type="button" className="admin-delete" onClick={() => setConfirming(true)}>
                    Delete
                </button>
                {fetcher.data?.error && <p className="admin-row-error">{fetcher.data.error}</p>}
            </>
        );
    }

    return (
        <fetcher.Form method="post" onSubmit={() => setConfirming(false)}>
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="paperId" value={paper.id} />
            <span className="admin-confirm__label">Delete permanently?</span>
            <div className="admin-confirm__actions">
                <button type="submit" className="admin-delete admin-delete--confirm">
                    Yes, delete
                </button>
                <button type="button" className="admin-cancel" onClick={() => setConfirming(false)}>
                    Cancel
                </button>
            </div>
        </fetcher.Form>
    );
}
