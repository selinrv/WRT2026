export default function Topics() {
    return (
        <section id="about" className="upcoming-section pt-150">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-6 col-xl-7 col-lg-8">
                        <div className="section-title text-center mb-60">
                            <h1>Know More About Upcoming Conference</h1>
                            <p>Conference topics</p>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    {topics.map(({name, descr}) => (
                        <div className="col-lg-4 col-md-8 col-sm-10">
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
    )
}

const topics = [
    {
        name: "Technologies, Filler Materials and Equipment",
        descr: "Development and improvement of welding and related technologies; research on filler materials including wires, rods, powders, and fluxes; innovations in welding and processing equipment",
    },
    {
        name: "Strength and Stress-Strain States of Welded Joints and Structures",
        descr: "Investigation of mechanical behavior, residual stresses, fatigue strength, and fracture mechanics of welded joints and structures under various loading and environmental conditions",
    },
    {
        name: "New Structural and Functional Materials",
        descr: "Design, processing, and application of advanced structural and functional materials, such as high-performance alloys, lightweight composites, and smart materials for modern industries",
    },
    {
        name: "Surface Engineering and Additive Technologies",
        descr: "rogress in surface modification methods (coating, hardfacing, cladding), additive manufacturing (e.g., SLM, DED), and hybrid processes for enhanced material performance",
    },
    {
        name: "Mathematical Modeling of Welding and Related Processes",
        descr: "Simulation and numerical modeling of thermal fields, fluid flow, metallurgical transformations, phase changes, and stress-strain states in welding and high-temperature processes",
    },
    {
        name: "Advanced Technologies of Special Electrometallurgy",
        descr: "Innovations in electroslag, vacuum arc, plasma, and electron beam remelting; recycling of high-value metallic waste; production of clean and specialized alloys and ingots",
    },
    {
        name: "Non-Destructive Testing and Technical Diagnostics",
        descr: "Modern methods of NDT (ultrasonic, radiographic, acoustic emission, etc.) and diagnostics for evaluating the integrity and safety of welded joints and components",
    },
    {
        name: "Medicine and Ecology of Welding Production",
        descr: "Occupational health and safety in welding environments; environmental impact of welding processes and materials; development of sustainable and eco-friendly technologies",
    },
    {
        name: "Artificial Intelligence and Smart Technology Applications",
        descr: "Use of AI, machine learning, and data analytics for process optimization, defect detection, predictive maintenance, and intelligent control in welding and manufacturing",
    },

]