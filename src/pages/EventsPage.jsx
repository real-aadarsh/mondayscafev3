import { eventSlides } from "../data/siteData";

export default function EventsPage() {
  return (
    <main className="route-main">
      <section className="section route-hero reveal-item">
        <div className="container">
          <p className="eyebrow">City Moments</p>
          <h1 className="route-title">Events at Mondays</h1>
          <p className="route-copy">From acoustic nights to brunch socials, every event is designed around community and craft.</p>
        </div>
      </section>

      <section className="section">
        <div className="container event-page-grid route-grid">
          {eventSlides.map((item) => (
            <article key={item.title} className="event-page-card reveal-item">
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="event-page-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a className="button button-primary" href="https://linktr.ee/mondays" target="_blank" rel="noreferrer">More Info</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
