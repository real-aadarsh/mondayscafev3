import { useEffect, useState } from "react";
import { eventSlides } from "../data/siteData";

export default function EventsPopup() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [eventIndex, setEventIndex] = useState(0);

  const activeEvent = eventSlides[eventIndex];

  useEffect(() => {
    if (sessionStorage.getItem("mondays_v2_event_seen") === "1") return;

    const timer = setTimeout(() => {
      setPopupOpen(true);
      sessionStorage.setItem("mondays_v2_event_seen", "1");
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!popupOpen || eventSlides.length < 2) return undefined;

    const timer = setInterval(() => {
      setEventIndex((prev) => (prev + 1) % eventSlides.length);
    }, 3600);

    return () => clearInterval(timer);
  }, [popupOpen]);

  useEffect(() => {
    const onEsc = (event) => {
      if (event.key === "Escape") {
        setPopupOpen(false);
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  if (!activeEvent) {
    return null;
  }

  return (
    <section className={`events-popup ${popupOpen ? "is-open" : ""}`} aria-hidden={!popupOpen}>
      <div className="events-popup-backdrop" onClick={() => setPopupOpen(false)}></div>
      <div className="events-popup-dialog" role="dialog" aria-modal="true" aria-labelledby="events-popup-title">
        <button className="events-popup-close" type="button" onClick={() => setPopupOpen(false)} aria-label="Close event popup">x</button>
        <p className="eyebrow">Now Happening</p>
        <h3 id="events-popup-title">Upcoming Events</h3>
        <p className="events-popup-copy">Tap through this event preview and open full details.</p>

        <div className="events-popup-media">
          <div className="events-slides" aria-label="Event image gallery">
            {eventSlides.map((slide, idx) => <img className={`events-slide ${idx === eventIndex ? "is-active" : ""}`} src={slide.image} alt={slide.title} key={slide.title} loading="lazy" />)}
            <button className="events-nav events-nav-prev" type="button" onClick={() => setEventIndex((prev) => (prev - 1 + eventSlides.length) % eventSlides.length)} aria-label="Previous">&lt;</button>
            <button className="events-nav events-nav-next" type="button" onClick={() => setEventIndex((prev) => (prev + 1) % eventSlides.length)} aria-label="Next">&gt;</button>
            <a className="button button-primary events-more-info-overlay" href="https://linktr.ee/mondays" target="_blank" rel="noreferrer">More Info</a>
          </div>
        </div>

        <div className="events-slide-meta"><h4 className="events-slide-title">{activeEvent.title}</h4><p className="events-slide-description">{activeEvent.description}</p></div>
      </div>
    </section>
  );
}
