import { Form, useActionData, useNavigation, useSearchParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import 'react-phone-number-input/style.css'
import { topics } from "./topics";

export const categories = [
    {
        label: "Regular",
        subtext: "Full Conference Package",
        price: "300€",
        earlybird: "250/300€",
        value: 300,
    },
    {
        label: "Regular",
        subtext: "Without Paper Publication",
        price: "200€",
        earlybird: "250/300€",
        value: 200,
    },
    {
        label: "Young Professional",
        subtext: "Full Conference Package",
        price: "200€",
        earlybird: "175/200€",
        value: 202,
    },
    {
        label: "Student",
        subtext: " ",
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
    {
        label: "Online",
        subtext: "",
        price: "0€",
        earlybird: "175/200€",
        value: 1,
    },
    {
        label: "Online",
        subtext: "With Paper Publication",
        price: "100€",
        earlybird: "175/200€",
        value: 100,
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
    const [onlineViewing, setOnlineViewing] = useState(false);
    const [coAuthors, setCoAuthors] = useState([{ name: "", organization: "", orcidId: "" }]);
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
        if (navigation.state === "idle" && formRef.current && !(data?.errors)) {
            formRef.current.reset();
        }
    }, [navigation.state]);

    useEffect(() => {
        if (data?.success) {
            toast.success("Thank you for registering! Check your email for your registration details and payment instructions.");
            setCoAuthors([{ name: "", organization: "", orcidId: "" }]);
        } else if (data?.errors) {
            toast.error("Something went wrong with your registration. Please check the form and try again.");
        }
    }, [data]);

    const handleChange = (e) => {
        const selectedValue = Number(e.target.value);
        const found = categories.find(c => c.value === selectedValue);
        setSelected(e.target.value || "");
        setSelectedText(found || "");
        // "Poster" is not available for the Online registration categories.
        if (found?.label === "Online" && type === "Poster") {
            setType("");
        }
        // The "Online viewing" option is only offered for the plain "Online" category,
        // so clear it when switching away to avoid a lingering hidden checked state.
        if (!(found?.label === "Online" && found?.subtext !== "With Paper Publication")) {
            setOnlineViewing(false);
        }
    };

    const handleCoAuthorChange = (index, field, val) => {
        setCoAuthors((prev) =>
            prev.map((ca, i) => (i === index ? { ...ca, [field]: val } : ca))
        );
    };

    const addCoAuthor = () => {
        setCoAuthors((prev) => [...prev, { name: "", organization: "", orcidId: "" }]);
    };

    const removeCoAuthor = (index) => {
        setCoAuthors((prev) => prev.filter((_, i) => i !== index));
    };

    // Only keep co-author rows that have at least one field filled in, then
    // serialize to a JSON string for the `co_authors` DB column.
    const coAuthorsJson = JSON.stringify(
        coAuthors.filter(
            (ca) => ca.name.trim() || ca.organization.trim() || ca.orcidId.trim()
        )
    );

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
        if (total == 201 || total == 202) {
            finalTotal = 200;
        } else if (total == 1) {
            finalTotal = 0;
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

    const coAuthorBtnBaseStyle = {
        width: "44px",
        height: "44px",
        flexShrink: 0,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        fontSize: "24px",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
    };
    const coAuthorAddBtnStyle = { ...coAuthorBtnBaseStyle, background: "#1a7f5a" };
    const coAuthorRemoveBtnStyle = { ...coAuthorBtnBaseStyle, background: "#b23b3b" };

    const selectedCategory = categories.find((c) => String(c.value) === String(selected));
    // "Poster" presentation is not offered for the Online registration categories.
    const isOnlineCategory = selectedCategory?.label === "Online";
    // The "Online viewing" checkbox is only offered for the plain "Online"
    // category — not "Online - With Paper Publication", which still needs an abstract.
    const isOnlineViewingEligible = isOnlineCategory && selectedCategory?.subtext !== "With Paper Publication";

    return (
        <section id="registration" className="contact-section pt-150 pb-100 pt-md-50">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-12 col-xl-12 col-lg-12">
                        <div className="section-title text-center mb-60">
                            <h3>Conference Registration Form</h3>
                            <p>Register and submit your abstract</p>
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
                                    {!onlineViewing && (
                                        <div className="col-md-6">
                                            <div className="single-form">
                                                <input type="text" className="form-input" id="orcidId" name="orcidId"
                                                       placeholder="ORCID iD (e.g. 0000-0002-1825-0097)" required />
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-md-6">
                                        <div className="single-form">
                                            <input type="text" className="form-input" id="institutions" name="institutions"
                                                   placeholder="Organization" />
                                        </div>
                                    </div>
                                    {!onlineViewing && (
                                    <div className="col-md-12">
                                        <label style={{ display: "block", marginBottom: "10px" }}>Co-Authors</label>
                                        {coAuthors.map((ca, index) => (
                                            <div key={index}
                                                 className="single-form"
                                                 style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
                                                <input type="text" className="form-input"
                                                       style={{ flex: 1, marginBottom: 0 }}
                                                       placeholder="Co-Author Name"
                                                       value={ca.name}
                                                       onChange={(e) => handleCoAuthorChange(index, "name", e.target.value)} />
                                                <input type="text" className="form-input"
                                                       style={{ flex: 1, marginBottom: 0 }}
                                                       placeholder="Organization"
                                                       value={ca.organization}
                                                       onChange={(e) => handleCoAuthorChange(index, "organization", e.target.value)} />
                                                <input type="text" className="form-input"
                                                       style={{ flex: 1, marginBottom: 0 }}
                                                       placeholder="ORCID iD"
                                                       value={ca.orcidId}
                                                       onChange={(e) => handleCoAuthorChange(index, "orcidId", e.target.value)} />
                                                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                                                    {coAuthors.length > 1 && (
                                                        <button type="button"
                                                                onClick={() => removeCoAuthor(index)}
                                                                aria-label="Remove co-author"
                                                                style={coAuthorRemoveBtnStyle}>&minus;</button>
                                                    )}
                                                    {index === coAuthors.length - 1 && (
                                                        <button type="button"
                                                                onClick={addCoAuthor}
                                                                aria-label="Add co-author"
                                                                style={coAuthorAddBtnStyle}>+</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <input type="hidden" name="co_authors" value={coAuthorsJson} />
                                    </div>
                                    )}
                                    <div className={onlineViewing ? "col-md-6" : "col-md-4"}>
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
                                                        {c.label} {c.subtext ? " - " + c.subtext : ""} / {c.price}
                                                    </option>
                                                ))}
                                            </select>

                                            <p>Selected: {selectedText ? selectedText.label + " / " + selectedText.price : ' '} </p>
                                            <input type="hidden" name="selected_category" value={selectedText ? selectedText.label + (selectedText.subtext ? " - " + selectedText.subtext : "") : ""} />
                                        </div>
                                    </div>
                                    {!onlineViewing && (
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
                                    )}
                                    {!onlineViewing && (
                                    <div className="col-md-3">
                                        <div className="single-form">
                                            <select
                                                value={type}
                                                name="p_type"
                                                onChange={(e) => setType(e.target.value)}
                                            >
                                                <option value="">-- Choose presentation type --</option>
                                                {types.map((c) => (
                                                    <option key={c.label} value={c.label}
                                                            disabled={isOnlineCategory && c.label === "Poster"}>
                                                        {c.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <p>Selected: {type}</p>
                                        </div>
                                    </div>
                                    )}
                                    {isOnlineViewingEligible && (
                                        <div className="col-md-12">
                                            <div className="single-form" style={{ display: "flex", alignItems: "center", minHeight: "56px" }}>
                                                <label style={{ marginBottom: 0 }}>
                                                    <input className="online-only-checkbox currency-checkbox" type="checkbox" checked={onlineViewing}
                                                           onChange={(e) => setOnlineViewing(e.target.checked)}
                                                    />
                                                    Viewing without abstract
                                                </label>
                                                <input type="hidden" name="online_viewing" value={onlineViewing ? "yes" : "no"} />
                                                {/* Online viewing carries no abstract, co-authors, ORCID, topic or
                                                presentation type. These are all NOT NULL columns, so send blank
                                                placeholders rather than omitting the fields entirely. */}
                                                {onlineViewing && (
                                                    <>
                                                        <input type="hidden" name="abstract_title" value=" " />
                                                        <input type="hidden" name="abstract" value=" " />
                                                        <input type="hidden" name="co_authors" value="[]" />
                                                        <input type="hidden" name="orcidId" value="" />
                                                        <input type="hidden" name="topic" value="" />
                                                        <input type="hidden" name="p_type" value="" />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {!onlineViewing && (
                                        <div className="col-md-12">
                                            <div className="single-form">
                                                <input type="text" className="form-input" id="abstract_title" name="abstract_title"
                                                       placeholder="Abstract Title" />
                                            </div>
                                        </div>
                                    )}

                                    {!onlineViewing && (
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
                                    )}
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
                                                I want printed copy of the book
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