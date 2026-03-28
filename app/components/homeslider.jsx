import { Modal, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useActionData, useNavigation } from 'react-router-dom';
import { useSubmit } from "react-router";
import { useFetcher } from 'react-router-dom';

export default function Homeslider() {

    const [isOpen, setIsOpen] = useState(false);
    const [show, setShow] = useState(false);
    const submit     = useSubmit();       // 👈 react-router's submit hook
    const actionData = useActionData();   // 👈 gets { success: true } back
    const navigation = useNavigation();   // 👈 tracks pending state

    const [error, setError]     = useState('');
    const fetcher = useFetcher();
    console.log("fetcher", fetcher)
    const success      = fetcher.data?.success;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {    // 👈 async, no page reload
        fetcher.submit(formData, {
            method: 'post',
            action: '/contact-form'
        });
    };

    useEffect(() => {
        if (success) {
            setShow(false);
            setFormData({ name: '', email: '', subject: 'general', message: '' });
        }
    }, [success]);


    return (
            <section id="home" className="hero-area img-bg">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="hero-content">

                            <h1>WRT <span>2026</span></h1>
                            <p>
                                VIII International Conference on <br />Welding and Related Technologies
                            </p>
                            <p className="date">5-9 October 2026</p>
                            <p className="date">Uzhhorod, Ukraine</p>
                            <Button className="contact-us-button" variant="primary" onClick={() => setShow(true)}>
                                Contact Us
                            </Button>
                            <Modal show={show} onHide={() => setShow(false)} centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Contact Form</Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter name"
                                                name="name"
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                name="email"
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-1">
                                            <div className="d-flex justify-content-between">
                                                <Form.Label>Message</Form.Label>
                                                <small className="text-muted">

                                                </small>
                                            </div>
                                            <Form.Control
                                                as="textarea"          // 👈 this turns it into a <textarea>
                                                name="message"
                                                rows={4}               // height in lines
                                                maxLength={500}        // character limit
                                                placeholder="Write your message here..."
                                                value={formData.message}
                                                onChange={handleChange}

                                                style={{ resize: 'vertical' }}  // allow vertical resize only
                                            />
                                            <Form.Text className="text-muted">
                                                Be as detailed as possible.
                                            </Form.Text>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
                                    <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="hero-img">
                            <img src="assets/img/hero/hero-wrt.jpg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
