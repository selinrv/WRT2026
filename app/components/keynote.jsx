import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function Keynote() {

    const speakers = [
        {
            name: 'Prof. Patricio F. Mendez',
            organization: 'Director, Canadian Center for Welding and Joining',
            img: 'assets/img/Image_Mendez_2026.jpeg',
            title: 'Handheld Laser Beam Welding and its Fast Adoption in Industry',
            abstract: 'Handheld Laser Beam Welding (HLBW) is the most impactful welding technology innovation since the adoption of inverters in arc processes. This technology has enough similarities with arc welding that it is being adopted at a very fast rate in welding shops across the world; simultaneously, the differences with arc welding enable welders with minimal skills to accomplish welds of the highest quality. Cost and equipment size are comparable to arc welding equipment, but unlike arc welding, torch standoff and travel speed are set by the process, eliminating the need for skills in torch control. Codes and standards are still not ready to treat the particular advantages and challenges of HLBW and its practical requirements. Safety is an issue of significant difference with arc welding, the focus of much effort. This presentation will discuss the physical considerations that enable the paradoxical advantages of HLBW.'
        },
        {
            name: 'Dr. Mykola Lavrskyi',
            organization: 'Research and Development Engineer, Institute of Technological Research for Materials, Metallurgy, and Processes',
            img: 'assets/img/photo_2026-09-03 09.59.11.jpeg',
            title: 'Deep Learning for EBSD-Based Phase Segmentation in Low-Carbon Steels',
            abstract: 'Characterizing the microstructure of multiphase steels is essential for process control and alloy design. This complex and time-consuming task can be automated using convolutional neural networks (CNNs). Significant progress in microstructure segmentation has been achieved by combining CNNs with the U-Net architecture and electron backscatter diffraction (EBSD) data. However, supervised learning requires large representative databases of labeled EBSD maps, which considerably complicates the preparation of training data. Weak supervision offers a promising approach to reduce this labeling effort. In this study, weakly supervised U-Net models are applied to discriminate martensite, upper bainite, and lower bainite in single-phase and multiphase EBSD maps. Their robustness to different EBSD acquisition conditions is also evaluated. The developed models achieve an overall segmentation accuracy exceeding 90%. This presentation will discuss their performance, limitations, and potential for automated steel microstructure characterization.'
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
    const lastTriggerRef = useRef(null)
    const closeButtonRef = useRef(null)

    const closeAbstract = () => {
        setOpenIndex(null)
        lastTriggerRef.current?.focus()
    }

    const toggleAbstract = (i, event) => {
        if (openIndex === i) {
            closeAbstract()
            return
        }
        lastTriggerRef.current = event?.currentTarget ?? null
        setOpenIndex(i)
    }

    // While the popup is open: close on Escape, lock page scroll, move focus in.
    useEffect(() => {
        if (openIndex === null) return

        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeAbstract()
        }
        document.addEventListener('keydown', onKeyDown)

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        closeButtonRef.current?.focus()

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = previousOverflow
        }
    }, [openIndex])

    const openSpeaker = openIndex === null ? null : speakers[openIndex]

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
                                                    aria-haspopup="dialog"
                                                    aria-expanded={openIndex === i}
                                                    onClick={(e) => toggleAbstract(i, e)}
                                                >
                                                    Read abstract
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </section>

            {openSpeaker && typeof document !== 'undefined' && createPortal(
                <div className="wrt-keynote__overlay" onClick={closeAbstract}>
                    <div
                        className="wrt-keynote__modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="wrt-keynote-modal-name"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="wrt-keynote__modal-close"
                            aria-label="Close abstract"
                            ref={closeButtonRef}
                            onClick={closeAbstract}
                        >
                            &times;
                        </button>

                        <div className="wrt-keynote__modal-head">
                            <img
                                className="wrt-keynote__modal-photo"
                                src={openSpeaker.img}
                                alt={openSpeaker.name}
                            />
                            <div>
                                <h3 className="wrt-keynote__modal-name" id="wrt-keynote-modal-name">
                                    {openSpeaker.name}
                                </h3>
                                <p className="wrt-keynote__modal-org">{openSpeaker.organization}</p>
                            </div>
                        </div>

                        <p className="wrt-keynote__modal-talk">{openSpeaker.title}</p>
                        <p className="wrt-keynote__modal-abstract">{openSpeaker.abstract}</p>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
