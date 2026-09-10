import ArHelmet from "../components/ar-helmet.jsx";

export function meta() {
    return [
        { title: "WRT2026 Augmented Reality" },
        {
            name: "description",
            content: "Try on a virtual welding helmet in your browser — augmented reality from WRT2026, the Welding and Related Technologies Conference 2026 in Uzhhorod, Ukraine.",
        },
    ];
}

export default function Component() {
    return (
        <section id="ar" className="contact-section pt-150 pb-100 pt-md-200">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-10 col-xl-11 col-lg-12">
                        <div className="section-title text-center mb-40">
                            <h3>augmented reality</h3>
                            <p>
                                Allow the camera and WRT2026 will fit a welding helmet to your face. Everything
                                runs in your browser — no video ever leaves your device.
                            </p>
                        </div>
                        <ArHelmet />
                    </div>
                </div>
            </div>
        </section>
    );
}
