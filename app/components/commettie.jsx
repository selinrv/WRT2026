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
            name: 'Maksym Khokhlov',
            img: 'assets/img/451704621_3275217939277376_1242551368050047420_n.jpg'
        },
        {
            name: 'Vadym Yashenkov',
            img: 'assets/img/yashenkov.jpg'
        },

    ]

    return(
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
                                    } />
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
    );
}