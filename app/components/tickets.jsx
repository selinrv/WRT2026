import { Link } from "react-router-dom";
import { categories } from "../components/registration";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
        <section id="pricing" className="pricing-section pt-150 pb-100 pt-md-50">
            <div className="container">
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 text-center">
                        <h3>Registration Fee</h3>
                        <p className="mt-3">Registration is open!</p>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, A11y]}
                        spaceBetween={10}
                        slidesPerView={4}
                        loop={true}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        navigation
                        style={{ width: "100%", height: "100%" }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                            },
                            400:{
                                slidesPerView:1,
                            },
                            639: {
                                slidesPerView: 1,
                            },
                            865:{
                                slidesPerView:3
                            },
                            1000:{
                                slidesPerView:3
                            },
                            1500:{
                                slidesPerView:4
                            },
                            1700:{
                                slidesPerView:4
                            }
                        }}
                    >
                        {categories.map((p, i) => (
                            <SwiperSlide key={i}>
                                <div className="col-sm-12 col-md-12 mb-12">
                                    <div className="single-pricing text-center p-4rounded">
                                        <h3>{p.label}</h3>
                                        <span className="price d-block my-3">
                                    <p>Regular</p>
                                            {p.price}
                                </span>
                                        <Link to="#contact-form" className="main-btn btn-hover"
                                              onClick={() => chooseAndScroll(p.value)}>Buy Ticket</Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>


                </div>
                <section className="registration-includes" aria-labelledby="registration-includes-title">

                    <div className="col-lg-12 text-center mb-5">
                        <h3>Conference Fee Includes</h3>
                        <p className="mt-3">
                            Your conference fee covers full participation in the scientific program, official
                            materials,
                            and key networking events—so you can focus on learning, sharing, and connecting.
                            </p>
                        </div>

                        <div className="benefits-grid">
                            <div className="benefit-card">
                                <h3>Full Program Access</h3>
                                <p>Entry to all plenary sessions, technical sections, and round-table discussions.</p>
                            </div>

                            <div className="benefit-card">
                                <h3>Participant Package</h3>
                                <p>Badge, program, and essential informational materials upon registration.</p>
                            </div>

                            <div className="benefit-card">
                                <h3>Abstract Publication</h3>
                                <p>Your submitted abstract will be published in the official conference abstracts book.</p>
                            </div>

                            <div className="benefit-card">
                                <h3>Open Access Publication*</h3>
                                <p>Scopus indexed Full paper Open Access publication online, accepted after peer review.
                                    <br /><span className="muted"> *400 euro conference fee with printed book.</span>
                                </p>
                            </div>

                            <div className="benefit-card">
                                <h3>On-Site Support</h3>
                                <p>Organizational and technical assistance throughout the event.</p>
                            </div>

                            <div className="benefit-card">
                                <h3>Certificate of Participation</h3>
                                <p>An official certificate confirming your participation in the conference.</p>
                            </div>

                            <div className="benefit-card">
                                <h3>Networking & Hospitality</h3>
                                <p>Coffee breaks during the conference days and a welcome reception.</p>
                            </div>

                            <div className="benefit-card">
                                <h3>Gala Dinner</h3>
                                <p>An evening event to celebrate and connect with colleagues and partners.</p>
                            </div>
                        </div>
                </section>

            </div>
        </section>
    )
}

const tickets = [
    {
        title: "Regular Participant",
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