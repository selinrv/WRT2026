import { useState } from 'react'

export default function Keynote() {

    const speakers = [
        {
            name: 'Patricio F. Mendez',
            organization: 'Canadian Center for Welding and Joining',
            img: 'assets/img/Image_Mendez_2026.jpeg',
            title: 'Handheld Laser Beam Welding and its Fast Adoption in Industry',
            abstract: 'Handheld Laser Beam Welding (HLBW) is the most impactful welding technology innovation since the adoption of inverters in arc processes. This technology has enough similarities with arc welding that it is being adopted at a very fast rate in welding shops across the world; simultaneously, the differences with arc welding enable welders with minimal skills to accomplish welds of the highest quality. Cost and equipment size are comparable to arc welding equipment, but unlike arc welding, torch standoff and travel speed are set by the process, eliminating the need for skills in torch control. Codes and standards are still not ready to treat the particular advantages and challenges of HLBW and its practical requirements. Safety is an issue of significant difference with arc welding, the focus of much effort. This presentation will discuss the physical considerations that enable the paradoxical advantages of HLBW.'
        },
        {
            name: 'TBD',
            organization: 'RWTH Aachen University',
            img: 'assets/img/reisgen.jpg',
            title: 'Digitalisation and AI in Modern Joining Technology',
            abstract: 'This talk explores how data-driven methods and machine learning are transforming welding production. Topics include in-process sensing, adaptive control, digital twins of joining processes, and the integration of quality assurance directly into the production line to move towards zero-defect manufacturing.'
        },
        {
            name: 'TBD',
            organization: 'SLV Halle GmbH',
            img: 'assets/img/keitel.jpg',
            title: 'Qualification and Certification in Welding Engineering',
            abstract: 'A review of current European and international frameworks for the qualification of welding personnel and the certification of welded products. The presentation addresses harmonisation of standards, the role of education and training, and the challenges of maintaining competence in a rapidly changing technological landscape.'
        },
        {
            name: 'TBD',
            organization: 'French National Centre for Scientific Research',
            img: 'assets/img/olive.jpg',
            title: 'Hydrogen Effects on Welded Structures',
            abstract: 'Hydrogen embrittlement remains a critical concern for the integrity of welded structures, particularly with the growing use of hydrogen as an energy carrier. This keynote covers the mechanisms of hydrogen uptake and diffusion in weld metal and heat-affected zones, experimental characterisation techniques, and strategies to mitigate hydrogen-induced cracking.'
        },
    ]

    const placeholderImg =
        'data:image/svg+xml,' +
        encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' +
            '<rect width="300" height="300" fill="#2c38cd"/>' +
            '<circle cx="150" cy="112" r="54" fill="#ffffff" fill-opacity="0.35"/>' +
            '<path d="M55 262c0-52 43-86 95-86s95 34 95 86z" fill="#ffffff" fill-opacity="0.35"/>' +
            '</svg>'
        )

    const [openIndex, setOpenIndex] = useState(null)

    const toggleAbstract = (i) => setOpenIndex(openIndex === i ? null : i)

    return (
        <>
            <section id="keynote-speakers" className="pb-100 pt-100 keynote-speakers">
                <div className="wrt-container">
                    <header className="wrt-section__head">
                        <h2 className="wrt-section__title">Keynote Speakers</h2>
                        <p className="wrt-section__subtitle">
                            Visionary perspectives from industry pioneers
                        </p>
                    </header>

                    <ul className="wrt-keynote__grid" role="list">
                        {speakers.map((s, i) => {
                            const isTBD = s.name === 'TBD'
                            return (
                                <li className="wrt-keynote__card" key={i}>
                                    <img
                                        className="wrt-keynote__photo"
                                        src={isTBD ? placeholderImg : s.img}
                                        alt={s.name}
                                    />
                                    <div className="wrt-keynote__body">
                                        <h3 className="wrt-keynote__name">{s.name}</h3>

                                        {!isTBD && (
                                            <>
                                                <p className="wrt-keynote__org">{s.organization}</p>
                                                <p className="wrt-keynote__talk">{s.title}</p>

                                                <button
                                                    type="button"
                                                    className="wrt-keynote__toggle"
                                                    aria-expanded={openIndex === i}
                                                    onClick={() => toggleAbstract(i)}
                                                >
                                                    {openIndex === i ? 'Hide abstract' : 'Read abstract'}
                                                </button>

                                                {openIndex === i && (
                                                    <p className="wrt-keynote__abstract">{s.abstract}</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </section>
        </>
    )
}
