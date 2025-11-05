import { Form, useActionData, useNavigation } from "react-router-dom";
import { useState } from "react";
import 'react-phone-number-input/style.css'
import { topics } from "./topics";


export default function RegistrationForm() {
    const data = useActionData();
    const [value, setValue] = useState();
    const [textareaValue, setTextareaValue] = useState("");
    const [selected, setSelected] = useState("");
    const [selectedText, setSelectedText] = useState("");
    const [topic, setTopic] = useState("");
    const [type, setType] = useState("");
    const [checked, setChecked] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const navigation = useNavigation();
    const isSubmitting = navigation.formData != null;
    const isBusy = navigation.state !== "idle";
    const types = [
        {
            label: "Oral in Person",
        },
        {
            label: "Oral Online",
        },
        {
            label: "Poster",
        }
    ]
    const limit = 3500;
    const categories = [
        {
            label: "Delegate/Expert",
            price: "350€",
            value: 350,
        },
        {
            label: "Young Professional",
            price: "175€",
            value: 175,
        },
        {
            label: "Student",
            price: "50€",
            value: 50,
        },
        {
            label: "Accompanying person / Visitor",
            price: "150€",
            value: 150,
        },
    ]

    const handleChange = (e) => {
        const selectedValue = Number(e.target.value);
        const found = categories.find(c => c.value === selectedValue);
        setSelected(e.target.value || "");
        setSelectedText(found || "");
    };

    function multiply(a, b) {
        return a * b;
    }

    return (
        <section id="registration" className="contact-section pt-100 pb-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-12 col-xl-12 col-lg-12">
                        <div className="section-title text-center mb-60">
                            <h3>Conference Registration Form</h3>
                            <h4>Register and submit your abstract</h4>
                            <p>Early Bird registration available!</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="contact-form-wrapper">
                            <Form method="post" id="contact-form" className="contact-form">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="single-form">
                                            <input type="text" className="form-input" id="name" name="author"
                                                   placeholder="Author Name" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="single-form">
                                            <input type="email" className="form-input" id="email" name="email"
                                                   placeholder="Author Email" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="single-form">
                                            <input type="text" className="form-input" id="coauthors" name="co_authors"
                                                   placeholder="Co-Authors" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="single-form">
                                            <input type="text" className="form-input" id="institutions" name="institutions"
                                                   placeholder="Institutions" />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="single-form">
                                            <select
                                                value={selected}
                                                name="category"
                                                onChange={handleChange}
                                            >
                                                <option value="">-- Choose your registration category --</option>
                                                {categories.map((c) => (
                                                    <option key={c.label} value={c.value}>
                                                        {c.label} / {c.price}
                                                    </option>
                                                ))}
                                            </select>

                                            <p>Selected: {selectedText ? selectedText.label + " / " + selectedText.price : ' '} </p>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div className="single-form">
                                            <select
                                                value={topic}
                                                name="topic"
                                                onChange={(e) => setTopic(e.target.value)}
                                            >
                                                <option value="">-- Choose your conference topic --</option>
                                                {topics.map((c) => (
                                                    <option key={c.name} value={c.name}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>

                                            <p>Selected: {topic}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="single-form">
                                            <select
                                                value={type}
                                                name="p_type"
                                                onChange={(e) => setType(e.target.value)}
                                            >
                                                <option value="">-- Choose presentation type --</option>
                                                {types.map((c) => (
                                                    <option key={c.label} value={c.label}>
                                                        {c.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <p>Selected: {type}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="single-form">
                                            <input type="text" className="form-input" id="abstract_title" name="abstract_title"
                                                   placeholder="Abstract Title" />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="single-form">
                                            <textarea value={value}
                                                      onChange={(e) => setTextareaValue(e.target.value)}
                                                      maxLength={limit}
                                                      rows={20}
                                                      cols={80}
                                                      className="form-input" id="country" name="abstract"
                                                   placeholder="Abstract" />
                                            <p>{textareaValue.length}/{limit} characters</p>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="single-form">
                                            <label>
                                                <input className="currency-checkbox" type="checkbox" checked={checked}
                                                    onChange={(e) => setChecked(e.target.checked)}
                                                />
                                                I want to pay in UAH
                                            </label>
                                            <input type="hidden" name="currency" value={checked ? "uah" : "euro"} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="single-form">
                                            <h3>Total:
                                                <span>
                                                    {checked ? multiply(selectedText.value, 48.5) : selectedText.value}
                                                    {checked ? " UAH" : " €"}
                                                </span>
                                            </h3>
                                            <input type="hidden" name="currency" value={checked ? "uah" : "euro"} />
                                            <input type="hidden" name="total" value={checked ? multiply(selectedText.value, 48.5) + " UAH" : selectedText.value + " €"} />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="submit-btn">
                                            <button type="submit" className={isSubmitting ? "main-btn btn-hover loading" : "main-btn btn-hover"} id="save-data"  disabled={isBusy}>
                                                {isSubmitting ? "Please wait, registration in process" : "Register"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="response" id="response"></div>
                                    </div>
                                </div>
                            </Form>
                            <div class="return-wrapper">
                                {data?.errors && <p style={{color: "red"}}>{JSON.stringify(data.errors.title)}</p>}
                                {data?.success && <p style={{color: "green"}}>Thank you for registration! You should now receive an email with your registration details and payment instructions!</p>}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}