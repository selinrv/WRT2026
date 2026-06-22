import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { links } from "../footer/footer"
import { Modal, Button } from 'react-bootstrap';


export default function Header() {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);

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
                                            link.id != 9
                                                ? <li className="nav-item">
                                                    <Link className="page-scroll" to={link.link}>{link.link_name}</Link>
                                                </li>
                                                : <li className="nav-item">
                                                    <Link className="page-scroll" onClick={() => setShow(true)}>{link.link_name}</Link>
                                                </li>
                                        ))}
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <Modal className="editorial-modal" show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Conference editorial policy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Editorial policy for Conference Proceedings</h5>
                    <ol>
                        <li><strong>Same Standards as Regular Publications.</strong> Conference proceedings must meet rigorous standards of integrity and peer review, specifically regarding:

                            <br/>Transparency — readers must be aware of how the content was evaluated
                            <br/>Accountability — readers must know who evaluated the work
                            <br/>Integrity — all efforts must be made to ensure published works are free from ethics and integrity concerns</li>
                        <li><strong>Peer Review.</strong>  The peer review process of conference proceedings is conducted by the conference organizer. </li>
                        <li><strong>Responsibilities of Conference Proceedings Organizers / Editors.</strong> Editorial decision makers for conference proceedings have ultimate responsibility for the decision to accept an article or abstract for publication. They are responsible for screening submissions for potentially fabricated content, maintaining detailed records of editorial communications and peer reviewer reports, and working with event organizers to eliminate any paper mill–related activity. </li>
                        <li><strong>Anti–Paper Mill Policy.</strong> We are aware that conference proceedings are occasionally exploited by paper mills — entities that manipulate publication processes for financial gain. This is considered a serious breach of publication ethics, and any suspicion of paper mill activity will be investigated to its fullest extent.</li>
                        <li><strong>Author Obligations.</strong> All authors are expected to follow our editorial policies on authorship, research and publication ethics, consent to publish identifiable information, and declaration of competing interests.</li>
                        <li><strong>Publication Formats. </strong>Conference proceedings can be published either as books or as journal supplements/special issues. These responsibilities apply to peer reviewers of conference proceedings in the form of both abstracts and manuscripts.</li>
                    </ol>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </header>

    )
}