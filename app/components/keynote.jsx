import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function Keynote() {

    const speakers = [
        {
            name: 'Prof. Igor Krivtsun',
            organization: 'Director, E.O.Paton Electric Welding Institute',
            country: 'Ukraine',
            flag: 'assets/img/flags/ukraine.svg',
            img: 'assets/img/photo_2026-09-18 16.15.06.jpeg',
            title: 'Research and development activities of the E.O. Paton Electric Welding Institute in the field of welding and related technologies',
            abstract: '',
            bio: 'Igor Krivtsun (born 1954, Ukrainian) graduated from the Faculty of Physics of Taras Shevchenko National University of Kyiv and has worked at the E.O. Paton Electric Welding Institute of the NAS of Ukraine since 1976. He has headed the Department for Gas Discharge Physics and Plasma Devices since 2004, became Deputy Director for Science in 2008, and has served as Director since 2021 (Acting Director from 2020). He holds a Ph.D. in Theoretical and Mathematical Physics (1987) and a Doctor of Technical Sciences degree (2003), and has been Professor of Materials Science since 2018. He was elected Corresponding Member (2006) and then Academician (2012) of the NAS of Ukraine in Materials Science and Welding of Metals. He has authored over 300 publications, including 5 monographs and 18 patents.\n' +
                '\n' +
                'He is a leading scientist in gas discharge physics and the theory of welding processes. His research covers the physics of low-temperature technological plasma, such as welding arcs, plasma jets and optical discharges, and the interaction of arc plasma and laser radiation with materials in arc, plasma, laser and hybrid welding, surfacing and coating. He developed the theory of electromagnetic properties of heterogeneous plasma systems, along with methods for calculating the radiation spectra of arc plasma, laser absorption and reflection by metals, and the composition, transport and optical properties of multi-component welding arc plasma.\n' +
                '\n' +
                'His work on hybrid laser-arc processes (1990–2006) received international recognition. He showed that a focused CO₂-laser beam interacting with an arc forms a combined laser-arc discharge with new capabilities for controlling heat input. This established hybrid laser-plasma welding and materials treatment as a new research area and led to integrated laser-arc plasma torches with no analogues worldwide. Under his leadership, new processes were developed, including laser-microplasma welding, laser-plasma powder cladding and ceramic spraying, and laser-plasma deposition of diamond-like coatings. His recent work applies a kinetic approach to model energy, mass and charge transfer in multi-component plasma near evaporating metal surfaces.\n' +
                '\n' +
                'Since 2010 he has headed the Chair of Laser Devices and Physical-Engineering Technologies at the National Technical University of Ukraine "Kyiv Polytechnic Institute", where he has been a professor since 2009. He also supervises postgraduate and doctoral training at PWI. He sits on thesis defence boards and on the editorial board of the Paton Welding Journal, and he is a member of the American Welding Society and ASM International. He collaborates with research institutions in Germany, the USA, China and other countries and takes part in international research projects.',
        },
        {
            name: 'Prof. Patricio F. Mendez',
            organization: 'Director, Canadian Center for Welding and Joining',
            country: 'Canada',
            flag: 'assets/img/flags/canada.svg',
            img: 'assets/img/Image_Mendez_2026.jpeg',
            title: 'Handheld Laser Beam Welding and its Fast Adoption in Industry',
            abstract: 'Handheld Laser Beam Welding (HLBW) is the most impactful welding technology innovation since the adoption of inverters in arc processes. This technology has enough similarities with arc welding that it is being adopted at a very fast rate in welding shops across the world; simultaneously, the differences with arc welding enable welders with minimal skills to accomplish welds of the highest quality. Cost and equipment size are comparable to arc welding equipment, but unlike arc welding, torch standoff and travel speed are set by the process, eliminating the need for skills in torch control. Codes and standards are still not ready to treat the particular advantages and challenges of HLBW and its practical requirements. Safety is an issue of significant difference with arc welding, the focus of much effort. This presentation will discuss the physical considerations that enable the paradoxical advantages of HLBW.',
            bio: 'Prof Mendez is the Weldco/Industry Chair in Welding and Joining and Director of Canadian Centre for Welding and Joining at the University of Alberta. His teaching and research focus on physics and mathematics of welding and materials processing. Applications include wear-protection overlays, procedure development, laser cladding, handheld laser welding, and additive manufacturing, always with the aim of helping people and industry improve quality, productivity, and costs. Before joining the University of Alberta, he was a professor at the Colorado School of Mines and a consulting engineer at Exponent Inc. In 1995, Dr. Mendez co-founded Semi-Solid Technologies Inc. in the US. Prof. Mendez holds a Ph.D. and an M.S. degree in Materials Engineering from MIT, and a Mechanical Engineering degree from the University of Buenos Aires. His work is known for its depth into the physics and mechanisms present in welding and additive manufacturing, and has been sponsored by companies and branches of the government in the US and Canada. He is a Fellow of the IIW, AWS, and CWBA, and has received numerous international awards and patents. His students are active leaders in the welding community worldwide.',
        },
        {
            name: 'Prof. Madeleine Du Toit',
            organization: 'School of Mechanical, Materials, Mechatronic and Biomedical Engineering; Chair, Weld Australia',
            country: 'Australia',
            flag: 'assets/img/flags/australia.svg',
            img: 'assets/img/0f14cb8d-7be6-43d6-aee7-3b3d87d03591.jpg',
            title: 'From Outback to Ocean - Confronting pipeline welding challenges in Australia',
            abstract: '',
            bio: '',
        },
        {
            name: 'Dr. Mykola Lavrskyi',
            organization: 'Research and Development Engineer, Institute of Technological Research for Materials, Metallurgy, and Processes',
            country: 'France',
            flag: 'assets/img/flags/france.svg',
            img: 'assets/img/photo_2026-09-03 09.59.11.jpeg',
            title: 'Deep Learning for EBSD-Based Phase Segmentation in Low-Carbon Steels',
            abstract: 'Characterizing the microstructure of multiphase steels is essential for process control and alloy design. This complex and time-consuming task can be automated using convolutional neural networks (CNNs). Significant progress in microstructure segmentation has been achieved by combining CNNs with the U-Net architecture and electron backscatter diffraction (EBSD) data. However, supervised learning requires large representative databases of labeled EBSD maps, which considerably complicates the preparation of training data. Weak supervision offers a promising approach to reduce this labeling effort. In this study, weakly supervised U-Net models are applied to discriminate martensite, upper bainite, and lower bainite in single-phase and multiphase EBSD maps. Their robustness to different EBSD acquisition conditions is also evaluated. The developed models achieve an overall segmentation accuracy exceeding 90%. This presentation will discuss their performance, limitations, and potential for automated steel microstructure characterization.',
            bio: '',
        },
        {
            name: 'Dr. Ebrahim Karimi Sibaki',
            organization: 'Head of Christian Doppler Laboratory for ReactiveFlows in Green Steel Production and Refinement, Technical University of Leoben',
            country: 'Austria',
            flag: 'assets/img/flags/austria.svg',
            img: 'assets/img/1698850524821.jpg',
            title: 'Multiphysics Modeling of Electroslag Remelting (ESR): From Fundamental Phenomena to Process Understanding',
            abstract: 'Electroslag remelting (ESR) is a secondary metallurgical process used for the further refining\n' +
                'and purification of metals following primary extraction and refining. In this process, a\n' +
                'consumable electrode is progressively melted through an electrically heated molten slag,\n' +
                'resulting in the formation of a refined ingot with improved cleanliness, homogeneity, and\n' +
                'solidification characteristics.\n' +
                'Over the past two decades, we have conducted extensive research on the numerical\n' +
                'simulation of ESR to improve the understanding of the complex and strongly coupled\n' +
                'physical, chemical, and electrochemical phenomena governing the process. These studies\n' +
                'have addressed the influence of the electric current path and applied frequency, electric\n' +
                'signals associated with electrode melting and slag-metal interface dynamics, the electrolytic\n' +
                'nature of metallurgical slags, and detailed modeling of electrode melting to predict the\n' +
                'electrode tip shape, immersion depth, and melting rate. In addition, we have investigated the\n' +
                'transport and distribution of non-metallic inclusions and the solidification behavior of the\n' +
                'ingot. More recently, the modeling framework has been extended to reactive transport\n' +
                'phenomena, including nitrogen absorption during pressurized electroslag remelting (PESR).\n' +
                'The developed models account for the strong coupling among fluid flow, electromagnetic\n' +
                'fields (magnetohydrodynamics, MHD), heat transfer, phase interfaces, and solidification, as\n' +
                'well as relevant species transport and reaction phenomena. To capture these multiphysics\n' +
                'interactions, various numerical approaches, including dynamic mesh techniques, the volume\n' +
                'of fluid (VOF) method, and the discrete phase model (DPM), have been employed.\n' +
                'The numerical models have been validated against available experimental data and industrial\n' +
                'measurements and have demonstrated good agreement, providing valuable insights that\n' +
                'support the optimization and troubleshooting of industrial-scale ESR processes.',
            bio: 'Ebrahim Karimi-Sibaki is an Associate Professor at Montanuniversität Leoben and Head of the Christian Doppler Laboratory for Reactive Flows in Green Steel Production and Refinement, Austria. He specializes in the simulation and modeling of metallurgical processes, with particular expertise in computational fluid dynamics (CFD), magnetohydrodynamics (MHD), electrometallurgy, and electrochemistry.\n' +
                'He has extensive experience in research, teaching, and industrial collaboration in the field of metallurgical technologies and has contributed to numerous national and international research projects. He is the author and co-author of more than 100 scientific publications and has presented his research at numerous international conferences and scientific meetings.\n' +
                'His current research focuses on multiphysics modeling of metallurgical processes, including coupled chemical and electrochemical reactions, mass transfer, fluid flow, and electromagnetic phenomena in slag-metal systems, with particular emphasis on applications in green steel production and refining processes.\n' +
                '\n',
        },
        {
            name: 'Prof. Sergio Amancio',
            organization: 'Deputy Head, Institute of Materials Science, Joining and Forming',
            country: 'Austria',
            flag: 'assets/img/flags/austria.svg',
            img: 'assets/img/Amancio_portrait_2(3).png',
            title: 'Friction-based spot welding and joining of thermoplastics and hybrid structures',
            abstract: 'The growing emphasis on sustainable mobility in the automotive and aerospace sectors is\n' +
                'driving the development of lightweight structures that minimize energy consumption and\n' +
                'greenhouse gas emissions. The demand for these structures is further reinforced by battery-\n' +
                'electric and hydrogen propulsion systems, which require the integration of heavy components,\n' +
                'including battery packs, hydrogen tanks, and fuel cell units. Thermoplastics, thermoplastic\n' +
                'composites, and metal-polymer hybrid structures offer an appealing balance of low mass,\n' +
                'corrosion resistance, and mechanical performance. However, their broader use is limited by the\n' +
                'different thermal, chemical, and mechanical properties of metals and polymers. Additionally,\n' +
                'the long cycles, tooling requirements, and geometric constraints of conventional lamination,\n' +
                'overmolding, fastening, and adhesive bonding methods restrict their use. This keynote will\n' +
                'discuss recent advancements in energy-efficient, friction-based spot welding and joining. The\n' +
                'focus will be on refill friction stir spot welding (RFSSW) of thermoplastics and thermoplastic\n' +
                'composites, as well as friction spot joining (FSpJ) of metal-composite hybrids. The process\n' +
                'physics are discussed in terms of frictional heating, the formation of keyhole-free joints, and\n' +
                'the interfacial mechanisms governing thermoplastic welding and hybrid-joint formation. Case\n' +
                'studies involving PMMA, carbon-fiber-reinforced PA66, and AA2024-T3/carbon-fiber-\n' +
                'reinforced PPS demonstrate the connection between processing, weld and joint microstructure,\n' +
                'weld and bonding-zone development, and quasi-static performance. The results show that high-\n' +
                'performance joints can be produced in seconds. For metal-polymer hybrid joints, pretreating\n' +
                'the metal surface can significantly impact joint strength and durability. Furthermore, attention\n' +
                'is given to spot joint damage tolerance. Mixed-mode I/II fracture testing and cohesive-zone\n' +
                'finite-element analysis reveal the mechanisms of failure. The fatigue crack growth stages and\n' +
                'drop-weight impact behavior are also briefly discussed. Accelerated and natural aging, together\n' +
                'with salt spray exposure, demonstrate the role of process-related microstructural zones in\n' +
                'preserving residual strength and delaying galvanic corrosion in hybrid joints. Finally, a hybrid\n' +
                'aircraft fuselage demonstrator illustrates the structural potential of combining RFSSW and\n' +
                'FSpJ, including substantial reductions in structural mass and mechanical fastener usage. In\n' +
                'summary, these findings establish friction-based spot processes as rapid, localized, and scalable\n' +
                'methods for manufacturing damage-tolerant thermoplastic and metal-composite structures for\n' +
                'future mobility.',
            bio: 'Prof. Dr. Sergio de Traglia Amancio Filho has been a full professor of Aerospace Materials and\n' +
                'Manufacturing Techniques at Graz University of Technology (TU Graz) in Austria since 2018.\n' +
                'AddiGonally, he has been an adjunct professor in the Welding Engineering Program at Ohio\n' +
                'State University (USA) since 2020. Dr. Amancio\'s research focuses on the correlaGon between\n' +
                'processing parameters, microstructure, and material properGes of joining and addiGve\n' +
                'manufacturing technologies for applicaGons in lightweight structures. His research focuses on\n' +
                'the fundamental science and engineering of hybrid and dissimilar structures, including metals,\n' +
                'polymers, composites, and, more recently, wood. Prior to joining TU Graz, he was a Helmholtz\n' +
                'Young InvesGgator Group Leader at Helmholtz-Zentrum Geesthacht in Germany and an\n' +
                'assistant professor ("Juniorprofessor") of joining technology at Hamburg University of\n' +
                'Technology (TU Hamburg). Dr. Amancio has been awarded 36 patents, co-authored over 360\n' +
                'technical publicaGons and co-edited three technical books. He has received naGonal and\n' +
                'internaGonal awards, including the Georg Sachs Prize in 2013 and the DGM Prize in 2022 from\n' +
                'the German Society for Materials Science (DGM); the Granjon Prize in 2009, the Yoshiaki Arata\n' +
                'Prize in 2023, and the Halil Kaya Gedik Prize in 2024 from the InternaGonal InsGtute of Welding\n' +
                '(IIW); and the 2025 Materials InnovaGon Medal from the FederaGon of European Materials\n' +
                'SocieGes (FEMS). Dr. Amancio has served as a technical expert on various scienGfic and\n' +
                'technical commibees in Europe and the Americas. He is currently the chairman of IIW\n' +
                'Commission XVI — Polymer Joining and Adhesive Technology.',
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
    const [activeTab, setActiveTab] = useState('abstract')
    const lastTriggerRef = useRef(null)
    const closeButtonRef = useRef(null)

    const closeAbstract = () => {
        setOpenIndex(null)
        lastTriggerRef.current?.focus()
    }

    const toggleAbstract = (i, event, tab = 'abstract') => {
        if (openIndex === i) {
            closeAbstract()
            return
        }
        lastTriggerRef.current = event?.currentTarget ?? null
        setActiveTab(tab)
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

    const tabs = [
        { id: 'abstract', label: 'Abstract' },
        { id: 'bio', label: 'Biography' },
    ]

    // Left/Right arrows move between tabs, per the WAI-ARIA tabs pattern.
    const onTabKeyDown = (e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
        const current = tabs.findIndex((t) => t.id === activeTab)
        const next = tabs[(current + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]
        setActiveTab(next.id)
        document.getElementById(`wrt-keynote-tab-${next.id}`)?.focus()
    }

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

                    <Swiper
                        className="wrt-keynote__grid"
                        modules={[Navigation, Pagination, A11y]}
                        wrapperTag="ul"
                        spaceBetween={20}
                        slidesPerView={1.15}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1200: { slidesPerView: 4 },
                        }}
                    >
                        {speakers.map((s, i) => {
                            const isTBD = s.name === 'TBD'
                            return (
                                <SwiperSlide tag="li" className={`wrt-keynote__card country-${s.country}`} key={i}>
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

                                                <p className="wrt-keynote__country">
                                                    <img
                                                        className="wrt-keynote__flag"
                                                        src={s.flag}
                                                        alt=""
                                                        aria-hidden="true"
                                                    />
                                                    <span className="country">{s.country}</span>
                                                </p>

                                                <p className="wrt-keynote__talk">{s.title}</p>

                                                <div className="wrt-keynote__actions">
                                                    <button
                                                        type="button"
                                                        className="wrt-keynote__toggle"
                                                        aria-haspopup="dialog"
                                                        aria-expanded={openIndex === i && activeTab === 'abstract'}
                                                        onClick={(e) => toggleAbstract(i, e)}
                                                    >
                                                        Read abstract
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="wrt-keynote__toggle"
                                                        aria-haspopup="dialog"
                                                        aria-expanded={openIndex === i && activeTab === 'bio'}
                                                        onClick={(e) => toggleAbstract(i, e, 'bio')}
                                                    >
                                                        About author
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
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



                        <div className={`wrt-keynote__modal-head speaker-${openSpeaker.country}`}>
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
                                <p className="wrt-keynote__country">
                                    <img
                                        className="wrt-keynote__flag"
                                        src={openSpeaker.flag}
                                        alt=""
                                        aria-hidden="true"
                                    />
                                    {openSpeaker.country}
                                </p>
                            </div>
                        </div>

                        <p className="wrt-keynote__modal-talk">{openSpeaker.title}</p>
                        <div className="wrt-keynote__tabs" role="tablist" aria-label="Speaker details">
                            {tabs.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    role="tab"
                                    id={`wrt-keynote-tab-${t.id}`}
                                    className="wrt-keynote__tab"
                                    aria-selected={activeTab === t.id}
                                    aria-controls={`wrt-keynote-panel-${t.id}`}
                                    tabIndex={activeTab === t.id ? 0 : -1}
                                    onClick={() => setActiveTab(t.id)}
                                    onKeyDown={onTabKeyDown}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {tabs.map((t) => (
                            <div
                                key={t.id}
                                role="tabpanel"
                                id={`wrt-keynote-panel-${t.id}`}
                                aria-labelledby={`wrt-keynote-tab-${t.id}`}
                                hidden={activeTab !== t.id}
                            >
                                <p className="wrt-keynote__modal-abstract">
                                    {openSpeaker[t.id] || 'Coming soon.'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
