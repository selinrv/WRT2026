import { Link } from "react-router-dom";

export default function PaperUploadCta() {
    return (
        <section id="submit-paper" className="submit-section pt-100 pb-150 pt-md-50">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-8 col-xl-9 col-lg-10">
                        <div className="section-title text-center mb-40">
                            <h3>Submit Your Paper</h3>
                            <p>Already registered? Upload your full manuscript for review and
                                publication in the WRT2026 conference proceedings.</p>
                            <p>Use the paper upload portal (link below) to submit your full paper.
                                The manuscript template and the Publication License Agreement are both available for download there.
                                <strong> Papers must not exceed 8 pages</strong>, and every submission must be accompanied by a signed <strong>Publication License Agreement</strong> — papers submitted without it cannot be published in the proceedings.</p>
                        </div>
                        <div className="text-center">
                            <Link to="/paper-upload" className="main-btn btn-hover">Upload Your Paper</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}