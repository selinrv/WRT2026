export default function Homeslider() {
    return (
            <section id="home" className="hero-area img-bg">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="hero-content">

                            <h1>WRT <span>2026</span></h1>
                            <p>
                                VIII International Conference on <br />Welding and Related Technologies
                            </p>
                            <p className="date">5-9 October 2026</p>
                            <p className="date">Uzhhorod, Ukraine</p>
                            <p className="logos">
                                {logos.map(({ id, class_name, link }) => (
                                    <img key={id} className={class_name} src={link} />
                                ))}
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="hero-img">
                            <img src="assets/img/hero/hero-wrt.jpg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const logos = [
    {
        id: 1,
        class_name: "intitutions-logos",
        link: "../assets/img/logo/Logo-IIW-Colour.png"
    },
    {
        id: 2,
        class_name: "intitutions-logos",
        link: "../assets/img/logo/iez.png"
    },
    {
        id: 3,
        class_name: "intitutions-logos",
        link: "../assets/img/logo/logo.jpg"
    },
];