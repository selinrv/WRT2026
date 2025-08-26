import { Form, useActionData } from "react-router-dom";
import { useState } from "react";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

export default function ContactForm() {
    const data = useActionData();
    const [value, setValue] = useState()
    return (
        <section id="contact" className="contact-section pt-100 pb-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-6 col-xl-7 col-lg-8">
                        <div className="section-title text-center mb-60">
                            <h3>Get In Touch</h3>
                            <p>Subscribe to our newsletter and stay informed about our events and registration
                                opening</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        <div className="contact-form-wrapper">
                            <Form method="post" id="contact-form" className="contact-form">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="single-form">
                                            <input type="text" className="form-input" id="name" name="name"
                                                   placeholder="Name" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="single-form">
                                            <input type="email" className="form-input" id="email" name="email"
                                                   placeholder="Email" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="single-form">
                                            <input type="text" className="form-input" id="country" name="country"
                                                   placeholder="Country" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="single-form">
                                            <PhoneInput
                                                placeholder="Enter phone number"
                                                value={value}
                                                name="number"
                                                onChange={setValue}/>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="submit-btn">
                                            <button type="submit" className="main-btn btn-hover" id="save-data">Send Message</button>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="response" id="response"></div>
                                    </div>
                                </div>
                            </Form>
                            {data?.errors && <p style={{color: "red"}}>{JSON.stringify(data.errors)}</p>}
                            {data?.success && <p style={{color: "green"}}>Saved!</p>}
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="contact-right">

                            <div className="single-item">
                                <div className="icon">
                                    <i className="lni lni-envelope"></i>
                                </div>
                                <div className="content">
                                    <p><a href="mailto:info@wrt2026.com.ua">info@wrt2026.com.ua</a></p>
                                </div>
                            </div>
                            <div className="single-item">
                                <div className="icon">
                                    <i className="lni lni-map-marker"></i>
                                </div>
                                <div className="content">
                                    <p>Uzhhorod, Ukraine</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}