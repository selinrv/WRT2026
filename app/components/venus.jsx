const venueImages = [
    {
        id: 1,
        src: "../../assets/img/venue/1.jpg",
        alt: "Derenivska Kupil Resort view"
    },
    {
        id: 2,
        src: "../../assets/img/venue/2.jpg",
        alt: "Conference hall at Derenivska Kupil"
    },
    {
        id: 3,
        src: "../../assets/img/venue/3.jpg",
        alt: "Resort territory and park"
    },
    {
        id: 4,
        src: "../../assets/img/venue/4.jpg",
        alt: "Thermal and wellness area"
    },
    {
        id: 5,
        src: "../../assets/img/venue/5.jpg",
        alt: "Thermal and wellness area"
    },
    {
        id: 6,
        src: "../../assets/img/venue/6.jpg",
        alt: "Thermal and wellness area"
    }
];

export default function Venue() {
    return (
        <section className="venue-section" id="venue-section">
            <div className="container">
                <div className="venue-content">
                    <div className="section-title text-center mb-40">
                        <h3>Conference Venue</h3>
                        <h4>Derenivska Kupil Resort, Zakarpattia</h4>
                        <p>Special Accommodation Fee for Conference Participants!</p>
                    </div>

                    <div className="venue-text">
                        <p>
                            Nestled in the picturesque village of Nyzhne Solotvyno in Zakarpattia,
                            Derenivska Kupil offers a serene and inspiring setting for your event.
                            With modern conference halls set amid luxuriant parkland and thermal-water
                            wellness facilities, it strikes a perfect balance between productivity and
                            relaxation.
                        </p>
                        <p>
                            The resort’s tranquil surroundings, framed by Carpathian forest and magnolia
                            gardens, provide a refreshing backdrop for networking and creative thinking.
                            Attendees will appreciate not only the professional event infrastructure but
                            also the opportunity to unwind with spa treatments, nature walks, and local
                            cuisine in the evening.
                        </p>
                        <p style={{fontWeight: 600}}>
                            After completing the registration form, you will receive a voucher by email that allows you to book your stay at the hotel at the special sale price.
                        </p>
                    </div>
                    <div className="button-wrapper pb-40 text-center">
                        <a href="https://derenivska-kupil.ua/en/booking/" target="_blank" className="main-btn btn-hover">Book now</a>
                    </div>
                    <div className="venue-gallery">
                        {venueImages.map(({id, src, alt}) => (
                            <div key={id} className="venue-gallery-item">
                                <img src={src} alt={alt}/>
                            </div>
                        ))}
                    </div>

                    <div className="venue-map">
                        <iframe
                            title="Venue map"
                            width="100%"
                            height="100%"
                            style={{border: 0}}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2640.3635198120583!2d22.44068257644757!3d48.56458597129373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473904cc2084e8f1%3A0x40f465832b7e557c!2sDerenivska%20Kupil!5e0!3m2!1sen!2sua!4v1762347315207!5m2!1sen!2sua"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}