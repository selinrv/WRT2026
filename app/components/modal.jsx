import { useState } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({ name: "", email: "" });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div>
                <div className="overlay" onClick={onClose}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Contact Form</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit">Submit</button>
                            <button type="button" onClick={onClose}>Cancel</button>
                        </form>
                    </div>
                </div>

        </div>
    );
}