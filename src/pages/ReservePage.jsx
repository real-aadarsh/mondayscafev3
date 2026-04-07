import ReserveForm from "../components/ReserveForm";

export default function ReservePage() {
  return (
    <main className="route-main">
      <section className="section route-hero reveal-item">
        <div className="container">
          <p className="eyebrow">Table Booking</p>
          <h1 className="route-title">Reserve Experience</h1>
          <p className="route-copy">Secure your table for brunch, coffee dates, or small gatherings with a personal touch.</p>
        </div>
      </section>

      <section className="section contact-section" id="reserve">
        <div className="container contact-grid">
          <div className="section-copy reveal-item">
            <h2>Reserve a Table</h2>
            <p>Planning a weekend breakfast or a small neighborhood gathering? Send us a note.</p>
            <div className="reserve-info-card">
              <p><strong>Book Us</strong><br />(123) 456-7890</p>
            </div>
          </div>
          <ReserveForm />
        </div>
      </section>
    </main>
  );
}
