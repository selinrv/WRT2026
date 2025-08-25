export default function Footer() {
    return (
        <footer className="footer">
            <div className="map-img">
                <img src="assets/img/footer/map-bg.svg" alt="" />
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="footer-links">
                            <ul>
                                {links.map(({ link_name, link }) => (
                                    <li>
                                        <a href={link}>{link_name}</a>
                                    </li>
                                ))}

                            </ul>
                        </div>
                    </div>
                </div>
                <div className="copyright-area">
                    <div className="row align-items-center">
                        <div className="col-md-6">

                        </div>
                        <div className="col-md-6">
                            <ul className="socials">
                                <li>
                                    <a href="javascript:void(0)">
                                        <i className="lni lni-facebook-filled"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)">
                                        <i className="lni lni-twitter-filled"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)">
                                        <i className="lni lni-instagram-filled"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)">
                                        <i className="lni lni-linkedin-original"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

const links = [
    {
        link_name: "Home",
        link: "#home"
    },
    {
        link_name: "Topics",
        link: "#about",
    },
    {
        link_name: "Contact Us",
        link: "#contact"
    }
]