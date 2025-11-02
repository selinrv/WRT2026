import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

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
                                <a className="navbar-brand" href="index.html">
                                    WRT2026
                                </a>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                        aria-expanded={open} aria-label="Toggle navigation"
                                        onClick={() => setOpen(v => !v)} >
                                    <span className="toggler-icon"></span>
                                    <span className="toggler-icon"></span>
                                    <span className="toggler-icon"></span>
                                </button>

                                <div className={`md:hidden overflow-hidden collapse navbar-collapse sub-menu-bar duration-300 ${open ? "in show" : "max-h-0"}`}
                                    id="navbarSupportedContent">
                                    <ul id="nav" className="navbar-nav ms-auto">
                                        <li className="nav-item">
                                            <Link className="page-scroll active" to={location}>Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="page-scroll" to="#about">Topics</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="page-scroll" to="#past-events-slider">Past Events</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="page-scroll" to="#past-papers">Papers</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="page-scroll" to="#registration">Registration</Link>
                                        </li>
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