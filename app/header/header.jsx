import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import RegistrationForm from "../components/registration";

export default function Header() {
    const location = useLocation();
    const [show, setShow] = useState(false);

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
                                        aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="toggler-icon"></span>
                                    <span className="toggler-icon"></span>
                                    <span className="toggler-icon"></span>
                                </button>

                                <div className="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                                    <ul id="nav" className="navbar-nav ms-auto">
                                        <li className="nav-item">
                                            <Link className="page-scroll active" to="https://wrt2026.com.ua">Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="page-scroll" to="#about">Topics</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="page-scroll" to="#contact">Contact</Link>
                                        </li>
                                        {/* <li className="nav-item">
                                             <Link className="page-scroll" onClick={() => setShow(true)} >Registration</Link>
                                         </li> */}
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>

                </Modal.Header>
                <Modal.Body >
                    <RegistrationForm />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => setShow(false)}>
                        Save changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </header>

    )
}