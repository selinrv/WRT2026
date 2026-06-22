export default function Deadlines() {
    const dates = [
        {
            id: 1,
            label: "Abstract submission",
            date: "August 1, 2026"
        },
        {
            id: 2,
            label: "Full paper submission",
            date: "October 1, 2026"
        },
        {
            id: 3,
            label: "Final program",
            date: "October 1, 2026"
        },
        {
            id: 4,
            label: "Conference starts",
            date: "October 5, 2026"
        },

    ]
    return(
        <section className="deadlines-section pt-150 pb-100 pt-md-50" id="dates">
            <div className="container">
                <div className="section-title mb-60">
                    <h3>Important Dates</h3>
                    <p>Key deadlines for authors and participants</p>
                </div>
                <div className="deadlines-list">
                    {dates.map((date) => (
                        <div className={
                            date.id == 4 ? "deadline-item highlight" : "deadline-item"}
                        >
                            <span className="deadline-label">{date.label}</span>
                            <span className="deadline-date">{date.date}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}