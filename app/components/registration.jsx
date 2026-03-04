import { Form, useActionData, useNavigation, useSearchParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import 'react-phone-number-input/style.css'
import { topics } from "./topics";

export const categories = [
    {
        label: "Delegate / Expert",
        price: "300€",
        earlybird: "250/300€",
        value: 300,
    },
    {
        label: "Young Professional",
        price: "200€",
        earlybird: "175/200€",
        value: 200,
    },
    {
        label: "Student",
        price: "50€",
        earlybird: "50€",
        value: 50,
    },
    {
        label: "Accompanying person / Visitor",
        price: "200€",
        earlybird: "175/200€",
        value: 201,
    },
]


export default function RegistrationForm() {
    const data = useActionData();
    const [value, setValue] = useState();
    const [textareaValue, setTextareaValue] = useState("");
    const [selected, setSelected] = useState("");
    const [selectedText, setSelectedText] = useState("");
    const [topic, setTopic] = useState("");
    const [type, setType] = useState("");
    const [checked, setChecked] = useState(false);
    const [book, setBook] = useState(false);
    const formRef = useRef();
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


    useEffect(() => {
        // When form finished submitting, clear it
        if (navigation.state === "idle" && formRef.current) {
            formRef.current.reset();
        }
    }, [navigation.state]);

    const handleChange = (e) => {
        const selectedValue = Number(e.target.value);
        const found = categories.find(c => c.value === selectedValue);
        setSelected(e.target.value || "");
        setSelectedText(found || "");
    };

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const price = searchParams.get("price");
        if (price) {
            setSelected(price);

            const el = document.getElementById("registration-category");
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, []);

    function multiply(a, b) {
        return a * b;
    }

    function setTotalValue(checked, book, total) {
        let finalTotal;
        if (total == 201) {
            finalTotal = 200;
        } else {
            finalTotal = total;
        }
        if (checked && !book) {
            return multiply(finalTotal, 51.3);
        } else if (checked && book) {
            const new_total = finalTotal + 100;
            return multiply(new_total, 51.3);
        } else if (!checked && book) {
            const new_total = finalTotal + 100;
            return new_total;
        } else {
            return finalTotal;
        }

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
                            <Form method="post" id="contact-form" className="contact-form" ref={formRef}>
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
                                                id="registration-category"
                                            >
                                                <option value="">-- Choose your registration category --</option>
                                                {categories.map((c) => (
                                                    <option key={c.label} value={c.value}>
                                                        {c.label} / {c.price}
                                                    </option>
                                                ))}
                                            </select>

                                            <p>Selected: {selectedText ? selectedText.label + " / " + selectedText.price : ' '} </p>
                                            <input type="hidden" name="selected_category" value={selectedText && selectedText.label} />
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
                                                   placeholder="Abstract  (No images, tables or equations)" />
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
                                            <label>
                                                <input className="currency-checkbox" type="checkbox" checked={book}
                                                    onChange={(e) => setBook(e.target.checked)}
                                                />
                                                I want printed copy of full paper publication
                                            </label>
                                            <input type="hidden" name="currency" value={book ? 100 : 0} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="single-form">
                                            <h3>Total:
                                                <span>
                                                    {setTotalValue(checked, book, selectedText.value)}
                                                    {checked ? " UAH" : " €"}
                                                </span>
                                            </h3>
                                            <input type="hidden" name="currency" value={checked ? "uah" : "euro"} />
                                            <input type="hidden" name="total" value={setTotalValue(checked, book, selectedText.value)} />
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