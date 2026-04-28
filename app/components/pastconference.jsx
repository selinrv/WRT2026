import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
export default function Past() {
    const abstracts = [
        { title: "Conference Abstracts 2024", href: "../../assets/files/Abstracts-WRT_-2024.pdf", cover: "../../assets/img/abstract_cover.png" },
        { title: "Conference Papers 2024", href: "https://www.taylorfrancis.com/books/oa-edit/10.1201/9781003518518/welding-related-technologies-igor-krivtsun-fuad-khoshnaw-ganna-polishko-serhiy-schwab-roman-selin", cover: "../../assets/img/procedings_cover.png" },
    ];
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth <= 768);
        checkWidth(); // initial check
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    return(
        <section className="abstracts-section pt-100 pb-100 pt-md-50" id="past-papers">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-6 col-xl-7 col-lg-8">
                        <div className="section-title text-center mb-60">
                            <h3>Read the Research</h3>
                            <p>Dive into the ideas, findings, and innovations presented at our past conference</p>
                        </div>
                    </div>
                </div>
                {isMobile ? (
                    <div className="row justify-content-center past-papers-mobile-carousel">
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={10}
                            slidesPerView={1.2}
                            centeredSlides
                            loop={true}
                            autoplay={{ delay: 4000 }}
                            navigation
                        >
                            {abstracts.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="single-pricing">
                                            <h3>{item.title}</h3>
                                            <a href={item.href}>
                                                <img src={item.cover} className="mb-50"/>
                                            </a>
                                            <a href={item.href} className="main-btn btn-hover">Download</a>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                ) : (
                        <div className="row justify-content-center past-papers-mobile-carousel">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="single-pricing">
                                    <h3>Conference Abstracts 2024</h3>
                                    <a href="../../assets/files/Abstracts-WRT_-2024.pdf">
                                        <img src="../../assets/img/abstract_cover.png" className="mb-50"/>
                                    </a>
                                    <a href="../../assets/files/Abstracts-WRT_-2024.pdf" className="main-btn btn-hover">Download</a>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="single-pricing">
                                    <h3>Conference Papers 2024</h3>
                                    <a target="_blank" href="https://www.taylorfrancis.com/books/oa-edit/10.1201/9781003518518/welding-related-technologies-igor-krivtsun-fuad-khoshnaw-ganna-polishko-serhiy-schwab-roman-selin">
                                        <img src="../../assets/img/procedings_cover.png" className="mb-50"/>
                                    </a>
                                    <a href="https://www.taylorfrancis.com/books/oa-edit/10.1201/9781003518518/welding-related-technologies-igor-krivtsun-fuad-khoshnaw-ganna-polishko-serhiy-schwab-roman-selin" className="main-btn btn-hover" target="_blank">Download</a>
                                </div>
                            </div>
                        </div>
                )}
            </div>
        </section>
    )
}