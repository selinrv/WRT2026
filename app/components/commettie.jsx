export default function Committie() {

    const comm = [
        {
            name: 'Leonid Lobanov',
            label: 'Head of Organizing Committee',
            img: 'assets/img/lobanov.jpg'
        },
        {
            name: 'Illia Klochkov',
            img: 'assets/img/klochkov-2-e1669198316988.jpg'
        },
        {
            name: 'Ganna Polishko',
            img: 'assets/img/1659448959810-350x350.jpg'
        },
        {
            name: 'Mariia Pryzihlei',
            img: 'assets/img/fb267f49-df6f-4748-89e4-331f347264a5-350x350.png'
        },
        {
            name: 'Roman Selin',
            img: 'assets/img/IMG_50071-350x350.jpg'
        },
        {
            name: 'Serhiy Schwab',
            img: 'assets/img/200122162815410-9218.jpg'
        },
        {
            name: 'Maksym Iurzhenko',
            img: 'assets/img/1733221352073.jpg'
        },
        {
            name: 'Vadym Yashenkov',
            img: 'assets/img/yashenkov.jpg'
        },
        {
            name: 'Lina Gribanova',
            img: 'assets/img/photo_2026-02-26 20.23.08.jpeg'
        },

    ]

    const intComm = [
        {
            name: 'Igor KRIVTSUN',
            country: 'Ukraine',
            label: 'Conference Chairman',
            institute: 'E.O.Paton Electric Welding Institute'
        },
        {
            name: 'Serhiy AKHONIN',
            country: 'Ukraine',
            institute: 'E.O.Paton Electric Welding Institute'
        },
        {
            name: 'Luca COSTA',
            country: 'Italy',
            institute: 'International Institute of Welding'
        },
        {
            name: 'Volodymyr KORZHYK',
            country: 'Ukraine',
            institute: 'E.O.Paton Electric Welding Institute'
        },
        {
            name: 'Viktor KVASNYTSKYI',
            country: 'Ukraine',
            institute: 'Igor Sikorsky Kyiv Polytechnic Institute'
        },
        {
            name: 'Steffen KEITEL',
            country: 'Germany',
            institute: 'Schweißtechnische Lehr-und Versuchsanstalt Halle GmbH'
        },
        {
            name: 'Serhiy MAKSYMOV',
            country: 'Ukraine',
            institute: 'E.O.Paton Electric Welding Institute'
        },
        {
            name: 'Zinoviy NAZARCHUK',
            country: 'Ukraine',
            institute: 'Karpenko Physico-Mechanical Institute',
        },
        {
            name: 'Jean-Marc OLIVE',
            country: 'France',
            institute: 'French National Centre for Scientific Research'
        },
        {
            name: 'Uwe REISGEN',
            country: 'Germany',
            institute: 'RWTH Aachen University',
        },
        {
            name: 'Viktor SHAPOVALOV',
            country: 'Ukraine',
            institute: 'E.O.Paton Electric Welding Institute'
        },
        {
            name: 'Oleksandra ANTONIOUK',
            country: 'Ukraine',
            institute: 'Kyiv Academic University'
        },
        {
            name: 'Igor VLADYMYRSKYI',
            country: 'Ukraine',
            institute: 'Igor Sikorsky Kyiv Polytechnic Institute'
        },
        {
            name: 'Valeriy POZNIAKOV',
            country: 'Ukraine',
            institute: 'E.O.Paton Electric Welding Institute'
        },
        {
            name: 'Viktor Gorbach',
            country: 'Ukraine',
            institute: 'International Research Centre for Advanced Functional Nanostructured Materials and Technologies'
        },
    ]

    return(
        <>
            <section id="international-committee" className="wrt-section wrt-committee">
                <div className="wrt-container">
                    <header className="wrt-section__head">
                        <h2 className="wrt-section__title">International Committee</h2>
                        <p className="wrt-section__subtitle">
                            International experts contributing to the scientific programme of WRT 2026.
                        </p>
                    </header>


                    <ul className="wrt-committee__grid" role="list">
                        {intComm.map((c) => (
                            <li className="wrt-committee__card">

                                <div className="wrt-committee__body">
                                    <h3 className="wrt-committee__name">{c.name}</h3>
                                    {/*<p className="wrt-committee__meta">E.O. Paton Electric Welding Institute, Kyiv</p>*/}
                                    <p className="wrt-committee__country">{c.country}</p>

                                    {(c.label || c.institute) &&
                                        (<div className="wrt-committee__tags" aria-label="Member tags">
                                            {c.label && (<span className="wrt-tag position-tag">{c.label}</span>)}
                                            {c.institute && (<span className="wrt-tag">{c.institute}</span>)}
                                        </div>)}
                                </div>
                            </li>
                        ))}

                    </ul>


                </div>
            </section>
            <section id="committee" className="committee-section pt-150 pb-100">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xxl-6 col-xl-7 col-lg-8">
                            <div className="section-title text-center mb-60">
                                <h3>Organization Committee</h3>
                                <p>Dedicated to excellence in organization and delivery</p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {comm.map((c) => (
                            <div className="col-lg-6">
                                <div className="schedule-item">
                                    <div className="image">
                                        <img src={c.img} alt="" className={
                                            c.name == "Mariia Pryzihlei" ? "addbg" : "" ||
                                            c.name == "Serhiy Schwab" ? "addBgS" : ""
                                        }/>
                                    </div>
                                    <div className="content">
                                        <h3>{c.name}</h3>
                                        <p>{c.label ?? c.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </section>

        </>
    );
}