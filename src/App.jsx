import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const heroImages = ["/monday1.jpg", "/monday2.jpg", "/monday3.jpg", "/monday4.jpg"];
const reels = ["/reel1.mp4", "/reel2.mp4", "/reel3.mp4", "/reel4.mp4", "/reel5.mp4"];

const reviews = [
  {
    title: "Google Review 1",
    copy: "Read this customer review directly on Google Maps.",
    url: "https://maps.app.goo.gl/9EsyrkrNNnB9nfSh6",
  },
  {
    title: "Google Review 2",
    copy: "Open the original Google review from this card.",
    url: "https://maps.app.goo.gl/LStEMRduzuoKt44s6",
  },
  {
    title: "Google Review 3",
    copy: "Tap below to read the full review on Google Maps.",
    url: "https://maps.app.goo.gl/N5ix68WvBzL2RJB28",
  },
];

const eventSlides = [
  {
    image: "/monday1.jpg",
    title: "Sunday Brunch Social",
    description: "Join us for a slow brunch morning with signature coffee and limited specials.",
  },
  {
    image: "/monday2.jpg",
    title: "Latte Art Evening",
    description: "Watch a live latte art demo and enjoy curated drinks with friends.",
  },
  {
    image: "/monday3.jpg",
    title: "Acoustic Coffee Night",
    description: "A cozy after-hours set with acoustic music and warm cafe favorites.",
  },
];

const reserveInitial = {
  name: "",
  email: "",
  phone: "",
  guests: "",
  reservation_date: "",
  reservation_time: "",
  message: "",
};

function ReelCard({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const playPromise = node.play();
            if (playPromise && typeof playPromise.catch === "function") {
              playPromise.catch(() => {
                // autoplay may be blocked depending on browser policy
              });
            }
          } else {
            node.pause();
          }
        });
      },
      { threshold: 0.65 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      node.pause();
    };
  }, []);

  return (
    <article className="reel-card reveal-item">
      <video ref={videoRef} className="reel-video" muted loop playsInline preload="none">
        <source src={src} type="video/mp4" />
      </video>
    </article>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [eventIndex, setEventIndex] = useState(0);
  const [reserveData, setReserveData] = useState(reserveInitial);
  const [reserveStatus, setReserveStatus] = useState({ tone: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeEvent = eventSlides[eventIndex];

  const navLinks = useMemo(
    () => [
      { href: "#top", label: "Home" },
      { href: "#breakfast", label: "Menu" },
      { href: "#about", label: "Gallery" },
      { href: "#gallery", label: "Reviews" },
      { href: "#reserve", label: "Reserve a Table" },
    ],
    [],
  );

  useEffect(() => {
    document.body.classList.add("page-ready");
    return () => document.body.classList.remove("page-ready");
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onEsc = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setPopupOpen(false);
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 720) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 14);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("mondays_v2_event_seen") === "1") {
      return;
    }

    const timer = setTimeout(() => {
      setPopupOpen(true);
      sessionStorage.setItem("mondays_v2_event_seen", "1");
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!popupOpen || eventSlides.length < 2) {
      return undefined;
    }

    const timer = setInterval(() => {
      setEventIndex((prev) => (prev + 1) % eventSlides.length);
    }, 3600);

    return () => clearInterval(timer);
  }, [popupOpen]);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll(".reveal-item"));

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -7% 0px" },
    );

    revealItems.forEach((item, idx) => {
      item.style.setProperty("--reveal-delay", `${(idx % 4) * 65}ms`);
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  const nextEvent = () => setEventIndex((prev) => (prev + 1) % eventSlides.length);
  const prevEvent = () => setEventIndex((prev) => (prev - 1 + eventSlides.length) % eventSlides.length);

  const onReserveChange = (event) => {
    const { name, value } = event.target;
    setReserveData((prev) => ({ ...prev, [name]: value }));
  };

  const onReserveSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitted) {
      return;
    }

    const required = ["name", "email", "phone", "guests", "reservation_date", "reservation_time"];
    const hasMissing = required.some((field) => !String(reserveData[field]).trim());

    if (hasMissing) {
      setReserveStatus({ tone: "is-error", text: "Please fill all required fields correctly before submitting." });
      return;
    }

    setIsSubmitting(true);
    setReserveStatus({ tone: "is-loading", text: "Sending your reservation request..." });

    try {
      const payload = new FormData();
      Object.entries(reserveData).forEach(([key, value]) => payload.append(key, value));
      payload.append("form_type", "Table Reservation");

      const response = await fetch("https://formspree.io/f/mvzvlpdv", {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        let errorText = "We could not send your request. Please try again.";

        try {
          const detail = await response.json();
          if (detail?.errors?.length) {
            errorText = detail.errors.map((item) => item.message).join(" ");
          }
        } catch {
          // keep default
        }

        throw new Error(errorText);
      }

      setIsSubmitted(true);
      setReserveStatus({
        tone: "is-success",
        text: "Reservation request sent successfully. We will contact you shortly to confirm.",
      });
    } catch (error) {
      setReserveStatus({
        tone: "is-error",
        text: error instanceof Error ? error.message : "We could not send your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className={`site-header ${menuOpen ? "menu-open" : ""} ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="container nav-wrap">
          <a className="brand" href="#top">
            MONDAYS <span className="brand-script">cafe</span>
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className="site-nav" aria-label="Primary">
            {navLinks.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-media" aria-hidden="true">
            {heroImages.map((src, idx) => (
              <div key={src} className={`hero-image ${idx === heroIndex ? "is-active" : ""}`} style={{ backgroundImage: `url(${src})` }}></div>
            ))}
          </div>
          <div className="hero-overlay"></div>
          <div className="container hero-content">
            <img src="/logo.jpg" alt="Mondays Cafe Logo" className="hero-logo" />
            <p className="hero-copy">
              Set beneath warm porch lights and the glow of evening windows, our little cafe is where fresh coffee,
              quiet conversation, and hearty breakfast plates make everyone feel like a regular.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#breakfast">
                View Menu
              </a>
              <a className="button button-secondary" href="#location">
                Direction
              </a>
            </div>
            <div className="hero-strip">
              <span>Specialty Coffee</span>
              <span>Weekend Events</span>
              <span>Neighborhood Vibes</span>
            </div>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="container">
            <div className="section-heading reveal-item">
              <p className="eyebrow">Gallery</p>
              <h2>
                <a className="follow-heading-link" href="https://www.instagram.com/mondayscafewpg/" target="_blank" rel="noreferrer">
                  <span>Follow MondaysCafe</span>
                </a>
              </h2>
            </div>

            <div className="reels-track">
              {reels.map((reel) => (
                <ReelCard key={reel} src={reel} />
              ))}

              <article className="reel-card follow-card reveal-item">
                <a className="follow-link" href="https://www.instagram.com/mondayscafewpg/" target="_blank" rel="noreferrer">
                  <span>Follow</span>
                  <small>@mondayscafewpg</small>
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="breakfast">
          <div className="container">
            <div className="section-heading reveal-item">
              <p className="eyebrow">Menu</p>
              <h2 className="menu-title">Morning and Afternoon Menu</h2>
            </div>

            <div className="menu-v2">
              <article className="menu-v2-card reveal-item">
                <h3>Morning Favourites</h3>
                <p>Espresso, cappuccino, matcha, bagels, breakfast sandwiches, protein oats.</p>
              </article>
              <article className="menu-v2-card reveal-item">
                <h3>Afternoon Bites</h3>
                <p>Sandwiches, snack boards, soup of the day, curated coffee and tea.</p>
              </article>
              <article className="menu-v2-card reveal-item">
                <h3>Weekend Specials</h3>
                <p>Seasonal pours, pastry drops, and limited event menu pairings.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="gallery">
          <div className="container">
            <div className="section-heading reveal-item">
              <h2 className="reviews-title">GOOGLE REVIEWS</h2>
            </div>

            <div className="reviews-track">
              {reviews.map((review) => (
                <article className="review-card reveal-item" key={review.url}>
                  <div className="review-head">
                    <div className="review-user">
                      <strong>{review.title}</strong>
                      <span>From live listing</span>
                    </div>
                  </div>
                  <p className="review-stars" aria-label="5 star rating">
                    *****
                  </p>
                  <p className="review-copy">{review.copy}</p>
                  <a className="review-link" href={review.url} target="_blank" rel="noreferrer">
                    View full review
                  </a>
                </article>
              ))}

              <article className="review-card review-open-card reveal-item">
                <a className="review-open-link" href="https://maps.app.goo.gl/G2eZsAs67ehTDq1V6" target="_blank" rel="noreferrer">
                  <span>Open Reviews</span>
                  <small>Google Maps</small>
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="section location-section" id="location">
          <div className="container location-grid">
            <div className="section-copy reveal-item">
              <h2>Directions</h2>
              <div className="location-card">
                <p className="invite-intro">We would love to welcome you into MondaysCafe for a warm meal and fresh coffee.</p>
                <div className="invite-details">
                  <p>
                    <strong>Address</strong>
                    <br />
                    Mondays Cafe
                    <br />
                    Winnipeg, MB, Canada
                  </p>
                  <p>
                    <strong>Opening Hours</strong>
                    <br />
                    Mon-Fri: 7:30am-5pm
                    <br />
                    Sat: 9am-7pm
                    <br />
                    Sun: 9am-4pm
                  </p>
                </div>
                <a className="button button-primary" href="https://maps.app.goo.gl/G2eZsAs67ehTDq1V6" target="_blank" rel="noreferrer">
                  Get Direction
                </a>
              </div>
            </div>

            <div className="map-card reveal-item">
              <iframe
                title="Map showing MondaysCafe"
                src="https://www.google.com/maps?q=Mondays%20Cafe%2C%20Winnipeg%2C%20MB%2C%20Canada&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="container contact-grid">
            <div className="section-copy reveal-item">
              <p className="eyebrow">Contact</p>
              <h2>Reserve a Table</h2>
              <p>Planning a weekend breakfast or a small neighborhood gathering? Send us a note.</p>
              <div className="reserve-info-card">
                <p>
                  <strong>Book Us</strong>
                  <br />
                  (123) 456-7890
                </p>
              </div>
            </div>

            <form className={`contact-form reveal-item ${isSubmitted ? "is-submitted" : ""}`} id="reserve" onSubmit={onReserveSubmit}>
              <label>
                Full Name
                <input type="text" name="name" value={reserveData.name} onChange={onReserveChange} required disabled={isSubmitted} />
              </label>
              <label>
                Email
                <input type="email" name="email" value={reserveData.email} onChange={onReserveChange} required disabled={isSubmitted} />
              </label>
              <label>
                Phone
                <input type="tel" name="phone" value={reserveData.phone} onChange={onReserveChange} required disabled={isSubmitted} />
              </label>
              <label>
                Number of Guests
                <input type="number" name="guests" min="1" max="20" value={reserveData.guests} onChange={onReserveChange} required disabled={isSubmitted} />
              </label>
              <label>
                Reservation Date
                <input type="date" name="reservation_date" value={reserveData.reservation_date} onChange={onReserveChange} required disabled={isSubmitted} />
              </label>
              <label>
                Reservation Time
                <input type="time" name="reservation_time" value={reserveData.reservation_time} onChange={onReserveChange} required disabled={isSubmitted} />
              </label>
              <label>
                Special Requests
                <textarea name="message" rows="4" value={reserveData.message} onChange={onReserveChange} disabled={isSubmitted}></textarea>
              </label>

              {!isSubmitted && (
                <button className="button button-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Reserve Table"}
                </button>
              )}

              <p className={`form-status ${reserveStatus.tone ? `is-visible ${reserveStatus.tone}` : ""}`}>{reserveStatus.text}</p>
            </form>
          </div>
        </section>
      </main>

      <section className={`events-popup ${popupOpen ? "is-open" : ""}`} aria-hidden={!popupOpen}>
        <div className="events-popup-backdrop" onClick={() => setPopupOpen(false)}></div>
        <div className="events-popup-dialog" role="dialog" aria-modal="true" aria-labelledby="events-popup-title">
          <button className="events-popup-close" type="button" onClick={() => setPopupOpen(false)} aria-label="Close event popup">
            x
          </button>
          <p className="eyebrow">Now Happening</p>
          <h3 id="events-popup-title">Upcoming Events</h3>
          <p className="events-popup-copy">Tap through this event preview and open full details.</p>

          <div className="events-popup-media">
            <div className="events-slides" aria-label="Event image gallery">
              {eventSlides.map((slide, idx) => (
                <img className={`events-slide ${idx === eventIndex ? "is-active" : ""}`} src={slide.image} alt={slide.title} key={slide.title} loading="lazy" />
              ))}

              <button className="events-nav events-nav-prev" type="button" onClick={prevEvent} aria-label="Previous">
                &lt;
              </button>
              <button className="events-nav events-nav-next" type="button" onClick={nextEvent} aria-label="Next">
                &gt;
              </button>
              <a className="button button-primary events-more-info-overlay" href="https://linktr.ee/mondays" target="_blank" rel="noreferrer">
                More Info
              </a>
            </div>
          </div>

          <div className="events-slide-meta">
            <h4 className="events-slide-title">{activeEvent.title}</h4>
            <p className="events-slide-description">{activeEvent.description}</p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-card reveal-item">
            <div className="footer-grid">
              <div>
                <a className="brand footer-brand" href="#top">
                  MONDAYS <span className="brand-script">cafe</span>
                </a>
                <p>Warm coffee, soft lighting, and a welcoming table in the heart of the neighborhood.</p>
              </div>
              <div>
                <h3>Visit</h3>
                <p>Mondays Cafe, Winnipeg, MB, Canada</p>
                <p>(123) 456-7890</p>
              </div>
              <div>
                <h3>Follow</h3>
                <div className="social-links">
                  <a href="https://www.instagram.com/mondayscafewpg/" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                  <a href="https://linktr.ee/mondays" target="_blank" rel="noreferrer">
                    Linktree
                  </a>
                  <a href="https://maps.app.goo.gl/G2eZsAs67ehTDq1V6" target="_blank" rel="noreferrer">
                    Google Maps
                  </a>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} MondaysCafe. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
