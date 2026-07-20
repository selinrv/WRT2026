export default function Topics() {
    return (
        <>
            <section id="about" className="upcoming-section pt-150 pt-md-50">
                <div className="about-wrapper pb-150 pb-md-100">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xxl-6 col-xl-7 col-lg-8">
                                <div className="section-title text-center mb-60">
                                    <h2>About the Conference</h2>
                                    <p>Welding and Related Technologies, October 5–9, 2026</p>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-xxl-8 col-xl-9 col-lg-10">
                                <div className="about-text">
                                    <p>
                                        The VIII International Conference on Welding and Related Technologies (WRT 2026)
                                        brings together researchers, engineers, and industry leaders from around the world
                                        to share the latest advances in welding science and engineering. The conference
                                        will be held on October 5–9, 2026, at the Derenivska Kupil Resort in the
                                        Zakarpattia region of Ukraine, combining a modern conference venue with spa and
                                        wellness amenities.
                                    </p>
                                    <p>
                                        WRT 2026 covers a broad spectrum of research areas — from welding technologies,
                                        filler materials, and equipment to the strength of welded structures, advanced
                                        structural and functional materials, surface engineering and additive manufacturing,
                                        mathematical modeling of welding processes, special electrometallurgy,
                                        non-destructive testing, the medicine and ecology of welding production, and the
                                        application of artificial intelligence in manufacturing.
                                    </p>
                                    <p>
                                        Guided by an international scientific editorial board of experts from Ukraine,
                                        Germany, Italy, France, and Poland, the conference offers presentations across all
                                        sessions, publication in Scopus-indexed proceedings, and rich networking
                                        opportunities for participants at every career stage.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="topics-wrapper">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xxl-6 col-xl-7 col-lg-8">
                                <div className="section-title text-center mb-60">
                                    <h2>Main Organizers</h2>
                                    <p>The Institutions Driving WRT 2026</p>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="logos">

                                {/* First row */}
                                <div className="logos-row">
                                    {mainOrgs.map(({id, name, role, logo, className, link}) => (
                                        <div key={id} className="org-logos">
                                            <a href={link}><img className={className} src={logo} alt={name}/></a>
                                            <a href={link}>
                                                <div className="org-name">{name}</div>
                                            </a>
                                            <div className="org-role">{role}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Second row (single item) */}
                                <div className="logos-row single">
                                    <div className="org-logos">
                                        <a href={coOrganizer.link}>
                                            <img
                                                className={coOrganizer.className}
                                                src={coOrganizer.logo}
                                                alt={coOrganizer.name}
                                            />
                                        </a>
                                        <a href={coOrganizer.link}>
                                            <div className="org-name">{coOrganizer.name}</div>
                                        </a>
                                        <div className="org-role">{coOrganizer.role}</div>

                                    </div>
                                </div>

                            </div>


                        </div>

                    </div>
                </div>
            </section>
            <section id="about" className="upcoming-section pt-150 pb-100">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xxl-6 col-xl-7 col-lg-8">
                            <div className="section-title text-center mb-60">
                                <h2>Know More About Upcoming Conference</h2>
                                <p>Conference topics</p>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        {topics.map(({id, name, descr}) => (
                            <div key={id} className="col-lg-4 col-md-8 col-sm-10">
                            <div className="single-counter">
                                    <div className="map-img">
                                        <img src="assets/img/upcoming/map-img.svg" alt="" />
                                    </div>
                                    <h4>{name}</h4>
                                    <span>{descr}</span>
                                </div>
                            </div>
                        ))}


                    </div>

                </div>
            </section>
        </>
    )
}

export const topics = [
    {
        id: 1,
        name: "Technologies, Filler Materials and Equipment",
        descr: "Development and improvement of welding and related technologies; research on filler materials including wires, rods, powders, and fluxes; innovations in welding and processing equipment",
    },
    {
        id: 2,
        name: "Strength and Stress-Strain States of Welded Joints and Structures",
        descr: "Investigation of mechanical behavior, residual stresses, fatigue strength, and fracture mechanics of welded joints and structures under various loading and environmental conditions",
    },
    {
        id: 3,
        name: "New Structural and Functional Materials",
        descr: "Design, processing, and application of advanced structural and functional materials, such as high-performance alloys, lightweight composites, and smart materials for modern industries",
    },
    {
        id: 4,
        name: "Surface Engineering and Additive Technologies",
        descr: "Progress in surface modification methods (coating, hardfacing, cladding), additive manufacturing (e.g., SLM, PAD, DED), and hybrid processes for enhanced material performance",
    },
    {
        id: 5,
        name: "Mathematical Modeling of Welding and Related Processes",
        descr: "Simulation and numerical modeling of thermal fields, fluid flow, metallurgical transformations, phase changes, and stress-strain states in welding and high-temperature processes",
    },
    {
        id: 6,
        name: "Advanced Technologies of Special Electrometallurgy",
        descr: "Innovations in electroslag, vacuum arc, plasma, and electron beam remelting; recycling of high-value metallic waste; production of clean and specialized alloys and ingots",
    },
    {
        id: 7,
        name: "Non-Destructive Testing and Technical Diagnostics",
        descr: "Modern methods of NDT (ultrasonic, radiographic, acoustic emission, etc.) and diagnostics for evaluating the integrity and safety of welded joints and components",
    },
    {
        id: 8,
        name: "Medicine and Ecology of Welding Production",
        descr: "Occupational health and safety in welding environments; environmental impact of welding processes and materials; development of sustainable and eco-friendly technologies",
    },
    {
        id: 9,
        name: "Artificial Intelligence and Smart Technology Applications",
        descr: "Use of AI, machine learning, and data analytics for process optimization, defect detection, predictive maintenance, and intelligent control in welding and manufacturing",
    },

];


const organizations = [
    {
        id: 1,
        name: "International Institute of Welding",
        role: "Associated event",
        logo: "../assets/img/logo/iiw.png",
        className: "institutions-logos iiw-logo",
        link: "https://iiwelding.org/"
    },
    {
        id: 2,
        name: "E.O. Paton Electric Welding Institute",
        role: "Organizer",
        logo: "../assets/img/logo/iez.png",
        className: "institutions-logos",
        link: "https://paton.org.ua/en"
    },
    {
        id: 3,
        name: "International Research Centre for Advanced Functional Nanostructured Materials and technologies",
        role: "Organizer",
        logo: "../assets/img/logo/logo-irc-1.png",
        className: "institutions-logos",
        link: "https://irc-nano.org/"
    },
    {
        id: 4,
        name: "Kyiv Academic University",
        role: "Co-Organizer",
        logo: "../assets/img/logo/KAU+tree_Large.png",
        className: "institutions-logos",
        link: "https://kau.org.ua/en/about",
    },
    {
        id: 5,
        name: "NGO 'WRTYS'",
        role: "Co-Organizer",
        logo: "../assets/img/logo/wrtys-ClOHIq4n.jpg",
        className: "institutions-logos wrtys-logo",
        link: "https://wrtys.org.ua/"
    }
];

const mainOrgs = organizations.slice(0, -1);
const coOrganizer = organizations.at(-1);