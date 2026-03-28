import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { links } from "../footer/footer"


export default function Header() {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    return (
        <header className="header">
            <div className="navbar-area">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <nav className="navbar navbar-expand-lg">
                                <a className="navbar-brand" href="/">
                                    <img src="assets/img/logo/logo.jpg" className="main-image-logo"/>
                                </a>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                        aria-expanded={open} aria-label="Toggle navigation"
                                        onClick={() => setOpen(v => !v)} >
                                    <span className="toggler-icon"></span>
                                    <span className="toggler-icon"></span>
                                    <span className="toggler-icon"></span>
                                </button>

                                <div
                                    className={`md:hidden overflow-hidden collapse navbar-collapse sub-menu-bar duration-300 ${open ? "in show" : "max-h-0"}`}
                                    id="navbarSupportedContent">
                                    <ul id="nav" className="navbar-nav ms-auto">
                                        {links.map((link) => (
                                            <li className="nav-item">
                                                <Link className="page-scroll" to={link.link}>{link.link_name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </header>

    )
}