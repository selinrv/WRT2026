import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Slider({ photos }) {
    return (
        <section id="past-events-slider" className="slider-section pt-100 pb-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-12 col-xl-12 col-lg-12">
                        <div className="section-title text-center mb-60">
                            <h3>Our Past Events</h3>
                            <p>Exploring the moments that advanced research and collaboration</p>
                        </div>
                    </div>
                </div>
                <div className="photo-swiper">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, A11y]}
                        spaceBetween={10}
                        slidesPerView={3}
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
                                slidesPerView:2
                            },
                            1000:{
                                slidesPerView:2
                            },
                            1500:{
                                slidesPerView:3
                            },
                            1700:{
                                slidesPerView:3
                            }
                        }}
                    >
                        {photos.map((p, i) => (
                            <SwiperSlide key={i}>
                                <img
                                    src={p.src}
                                    alt={p.alt || `Slide ${i + 1}`}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        objectFit: "cover",
                                    }}
                                    loading="lazy"
                                />
                                {p.caption && (
                                    <p
                                        style={{
                                            position: "absolute",
                                            bottom: "10px",
                                            left: "0",
                                            right: "0",
                                            textAlign: "center",
                                            color: "white",
                                            background: "rgba(0,0,0,0.4)",
                                            padding: "6px 0",
                                        }}
                                    >
                                        {p.caption}
                                    </p>
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}