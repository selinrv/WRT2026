import { Link } from "react-router-dom";
import { categories } from "../components/registration";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
export default function Tickets() {
    const [searchParams] = useSearchParams();
    const chooseAndScroll = (price) => {
        const select = document.getElementById("registration-category");
        if (!select) return;

        if (price) {
            select.value = price;
            select.dispatchEvent(new Event("change", {bubbles: true}));
            select.scrollIntoView({behavior: "smooth", block: "center"});
            select.focus?.();
        }
    };

    return (
        <section id="pricing" className="pricing-section pt-150">
            <div className="container">
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 text-center">
                        <h3>Registration Fee</h3>
                        <p className="mt-3">Early Bird Pricing: Lowest Rate Available</p>
                    </div>
                </div>

                <div className="row justify-content-center">
                    {categories.map((ticket) => (
                        <div className="col-md-3 mb-4">
                            <div className="single-pricing text-center p-4rounded">
                                <h3>{ticket.label}</h3>
                                <span className="price d-block my-3">{ticket.price}</span>
                                <Link to="#contact-form" className="main-btn btn-hover" onClick={() => chooseAndScroll(ticket.value)}>Buy Ticket</Link>
                            </div>
                        </div>
                        ))}
                </div>


            </div>
        </section>
    )
}

const tickets = [
    {
        title: "Delegate/Expert",
        price: 350,
    },
    {
        title: "Young Professional",
        price: 175,
    },
    {
        title: "Student",
        price: 50,
    },
    {
        title: "Accompanying person",
        price: 150,
    },
]