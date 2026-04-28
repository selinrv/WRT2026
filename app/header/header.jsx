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
                    <h5>Our editorial policy is based on our partners Taylor & Francis Editorial Policy for Conference Proceedings</h5>
                    <ol>
                        <li><strong>Same Standards as Regular Publications.</strong> All conference proceedings published by Taylor & Francis must meet the same rigorous standards of integrity and peer review as their other academic content Taylor & Francis, specifically regarding:

                            <br/>Transparency — readers must be aware of how the content was evaluated
                            <br/>Accountability — readers must know who evaluated the work
                            <br/>Integrity — all efforts must be made to ensure published works are free from ethics and integrity concerns</li>
                        <li><strong>Peer Review.</strong>  The peer review process of conference proceedings is typically conducted by the conference organizer and is usually outside the processes and editorial oversight of Taylor & Francis. However, peer review standards must meet the same editorial and ethical standards as peer review of standard content, and conference organizers must adhere to the Taylor & Francis code of conduct. Taylor & Francis
                            Transparency statements listing the name of the event, the organizers, and the names of those with overall editorial responsibility must be included in all conference proceedings. Taylor & Francis</li>
                        <li><strong>Responsibilities of Conference Proceedings Organizers / Editors.</strong> Editorial decision makers for conference proceedings have ultimate responsibility for the decision to accept an article or abstract for publication. They are responsible for screening submissions for potentially fabricated content, maintaining detailed records of editorial communications and peer reviewer reports, and working with event organizers to eliminate any paper mill–related activity. They are also responsible for alerting Taylor & Francis if paper mill activity or any other type of misconduct is suspected. Taylor & Francis</li>
                        <li><strong>Anti–Paper Mill Policy.</strong> Taylor & Francis is aware that conference proceedings are occasionally exploited by paper mills — entities that manipulate publication processes for financial gain. This is considered a serious breach of publication ethics, and any suspicion of paper mill activity will be investigated to its fullest extent. Taylor & Francis</li>
                        <li><strong>Author Obligations.</strong> All authors are expected to follow Taylor & Francis's editorial policies on authorship, research and publication ethics, consent to publish identifiable information, and declaration of competing interests. Taylor & Francis</li>
                        <li><strong>Submitting a Conference Paper to a Journal Afterward.</strong> Conference papers that have been presented and published in conference proceedings can be submitted for consideration to Taylor & Francis journals. However, authors must clearly state in the cover letter that a version of the manuscript is already in the public domain through conference proceedings. Authors may also need to check the copyright status of the conference proceedings and seek permission to reproduce the work if necessary. Taylor & Francis</li>
                        <li><strong>Publication Formats. </strong>Conference proceedings can be published either as books (under Routledge, CRC Press, or other T&F imprints) or as journal supplements/special issues. These responsibilities apply to peer reviewers of conference proceedings in the form of both abstracts and manuscripts, regardless of whether they are published in Taylor & Francis journals or as books.</li>
                    </ol>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </header>

    )
}