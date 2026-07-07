import { useFetcher } from "react-router-dom";
import { useState } from "react";

function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function PaperStatusChecker() {
    const fetcher = useFetcher();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const isLoading = fetcher.state !== "idle";
    const results = fetcher.data?.statusResults;
    const searchedEmail = fetcher.data?.statusEmail;
    const hasSearched = fetcher.data != null && !isLoading;

    function check(e) {
        e.preventDefault();
        const trimmed = email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setError("Please enter a valid email address.");
            return;
        }
        setError("");
        fetcher.submit({ intent: "check-status", email: trimmed }, { method: "post" });
    }

    return (
        <section id="paper-status" className="contact-section pb-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-10 col-xl-11 col-lg-12">
                        <div className="section-title text-center mb-40">
                            <h3>Check Your Paper Status</h3>
                            <p>Enter your email to see the status of every manuscript you submitted</p>
                        </div>

                        <div className="contact-form-wrapper">
                            <form className="contact-form ps-form" onSubmit={check}>
                                <div className="ps-search">
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="Your submission email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className={isLoading ? "main-btn btn-hover loading" : "main-btn btn-hover"}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Checking…" : "Check status"}
                                    </button>
                                </div>
                                {error && <p className="ps-error">{error}</p>}
                            </form>

                            {hasSearched && (
                                <div className="ps-results">
                                    {results && results.length > 0 ? (
                                        <>
                                            <p className="ps-results__count">
                                                {results.length} manuscript{results.length > 1 ? "s" : ""} found for{" "}
                                                <strong>{searchedEmail}</strong>
                                            </p>
                                            <ul className="ps-list">
                                                {results.map((p) => (
                                                    <li key={p.id} className="ps-item">
                                                        <div className="ps-item__head">
                                                            <strong className="ps-item__title">{p.paper_title}</strong>
                                                            <span className="ps-item__date">Submitted {formatDate(p.createdAt)}</span>
                                                        </div>
                                                        <div className="ps-item__status">
                                                            <span className="ps-status-dot" />
                                                            <span>{p.status}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <p className="ps-empty">
                                            No manuscripts found for <strong>{searchedEmail}</strong>. Please make sure you
                                            use the same email you submitted your paper with.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{paperStatusStyles}</style>
        </section>
    );
}

const paperStatusStyles = `
.ps-search { display:flex; gap:12px; flex-wrap:wrap; align-items:stretch; }
.ps-search .form-input { flex:1 1 260px; }
.ps-search .main-btn { flex:0 0 auto; }
.ps-error { color:#dc2626; font-size:13px; margin-top:8px; }
.ps-results { margin-top:26px; }
.ps-results__count { color:#cbd2de; margin-bottom:14px; }
.ps-results__count strong { color:#fff; }
.ps-empty { color:#374151; background:#fbfcfe; border:1px solid #eef1f6; border-radius:14px; padding:18px 22px; }
.ps-empty strong { color:#1f2937; }
.ps-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:12px; }
.ps-item { background:#fbfcfe; border:1px solid #eef1f6; border-radius:14px; padding:16px 20px; }
.ps-item__head { display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.ps-item__title { color:#1f2937; font-size:16px; word-break:break-word; }
.ps-item__date { color:#9aa3b2; font-size:13px; white-space:nowrap; }
.ps-item__status { display:flex; align-items:center; gap:8px; margin-top:10px; color:#1c63ff; font-weight:600; font-size:14px; }
.ps-status-dot { width:9px; height:9px; border-radius:50%; background:#1c63ff; flex:0 0 auto; }
`;
