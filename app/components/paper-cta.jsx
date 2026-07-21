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