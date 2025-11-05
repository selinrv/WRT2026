export default function Venue() {
    return (
        <section className="venue-section" id="venue-section">
            <div className="container">
                <div className="row justify-content-center">

                    <div className="col-lg-6 offset-lg-6">
                        <div className="section-title  mb-60">
                            <h3>Conference Venue</h3>
                            <h4>Derenivska Kupil Resort, Zakarpattia</h4>
                            <p>Where science meets serenity in the heart of the Carpathians</p>
                        </div>
                        <p>
                            Nestled in the picturesque village of Nyzhne Solotvyno in Zakarpattia,
                            Derenivska Kupil offers a serene and inspiring setting for your event.
                            With modern conference halls set amid luxuriant parkland and thermal-water wellness
                            facilities,
                            it strikes a perfect balance between productivity and relaxation.
                            The resort’s tranquil surroundings—framed by Carpathian forest and magnolia gardens—provide
                            a refreshing
                            backdrop for networking and creative thinking. Attendees will appreciate not only the
                            professional event
                            infrastructure but also the opportunity to unwind with spa treatments, nature walks or local
                            cuisine
                            in the evening.
                        </p>
                        <div style={{height: 300}}>
                            <iframe
                                title="Venue map"
                                width="100%"
                                height="100%"
                                style={{border: 0}}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2640.3635198120583!2d22.44068257644757!3d48.56458597129373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473904cc2084e8f1%3A0x40f465832b7e557c!2sDerenivska%20Kupil!5e0!3m2!1sen!2sua!4v1762347315207!5m2!1sen!2sua`} // paste the URL from Google Maps > Share > Embed a map
                            />
                        </div>
                    </div>
                </div>
                <div className="countdown-img">
                    <img src="../../assets/img/venue/venue-1.png" alt=""/>
                </div>
            </div>
        </section>
    )
}