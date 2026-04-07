import { useEffect, useMemo, useState } from "react";
import ReelCard from "../components/ReelCard";
import { advisorMenu, heroImages, moods, moments, reels, reviews, styles } from "../data/siteData";

function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [advisorMood, setAdvisorMood] = useState("comfort");
  const [advisorMoment, setAdvisorMoment] = useState("morning");
  const [advisorStyle, setAdvisorStyle] = useState("classic");

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const advisorSuggestions = useMemo(() => {
    return advisorMenu
      .map((item) => {
        let score = 0;
        if (item.mood.includes(advisorMood)) score += 4;
        if (item.moment.includes(advisorMoment)) score += 3;
        if (item.style.includes(advisorStyle)) score += 3;
        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [advisorMood, advisorMoment, advisorStyle]);

  return (
    <>
      <section className="hero" id="top">
        <div className="hero-media" aria-hidden="true">
          {heroImages.map((src, idx) => (
            <div key={src} className={`hero-image ${idx === heroIndex ? "is-active" : ""}`} style={{ backgroundImage: `url(${src})` }}></div>
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <img src="/logo.jpg" alt="Mondays Cafe Logo" className="hero-logo" />
          <p className="hero-copy">Set beneath warm porch lights and the glow of evening windows, our little cafe is where fresh coffee, quiet conversation, and hearty breakfast plates make everyone feel like a regular.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="/menu">View Menu</a>
            <a className="button button-secondary" href="#advisor">Mood Advisor</a>
          </div>
          <div className="hero-strip"><span>Specialty Coffee</span><span>Weekend Events</span><span>Neighborhood Vibes</span></div>
        </div>
      </section>

      <section className="section" id="advisor">
        <div className="container advisor-wrap reveal-item">
          <div className="section-heading advisor-head">
            <p className="eyebrow">Smart Experience</p>
            <h2>Menu Mood Advisor</h2>
            <p className="advisor-sub">Pick your vibe and we will suggest the best cafe combo for this moment.</p>
          </div>

          <div className="advisor-panel">
            <div className="advisor-control">
              <h3>Mood</h3>
              <div className="chip-row">
                {moods.map((mood) => (
                  <button key={mood} type="button" className={`chip ${advisorMood === mood ? "is-active" : ""}`} onClick={() => setAdvisorMood(mood)}>{mood}</button>
                ))}
              </div>
            </div>

            <div className="advisor-control">
              <h3>Time</h3>
              <div className="chip-row">
                {moments.map((moment) => (
                  <button key={moment} type="button" className={`chip ${advisorMoment === moment ? "is-active" : ""}`} onClick={() => setAdvisorMoment(moment)}>{moment}</button>
                ))}
              </div>
            </div>

            <div className="advisor-control">
              <h3>Style</h3>
              <div className="chip-row">
                {styles.map((style) => (
                  <button key={style} type="button" className={`chip ${advisorStyle === style ? "is-active" : ""}`} onClick={() => setAdvisorStyle(style)}>{style}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="advisor-results">
            {advisorSuggestions.map((item) => (
              <article key={item.name} className="advisor-card">
                <span className="advisor-score">Match {Math.min(99, item.score * 11)}%</span>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="container">
          <div className="section-heading reveal-item">
            <p className="eyebrow">Gallery</p>
            <h2><a className="follow-heading-link" href="https://www.instagram.com/mondayscafewpg/" target="_blank" rel="noreferrer"><span>Follow MondaysCafe</span></a></h2>
          </div>
          <div className="reels-track">
            {reels.map((reel) => <ReelCard key={reel} src={reel} />)}
            <article className="reel-card follow-card reveal-item"><a className="follow-link" href="https://www.instagram.com/mondayscafewpg/" target="_blank" rel="noreferrer"><span>Follow</span><small>@mondayscafewpg</small></a></article>
          </div>
        </div>
      </section>

      <section className="section" id="gallery">
        <div className="container">
          <div className="section-heading reveal-item"><h2 className="reviews-title">Google Reviews</h2></div>
          <div className="reviews-track">
            {reviews.map((review) => (
              <article className="review-card reveal-item" key={review.url}>
                <div className="review-head"><div className="review-user"><strong>{review.title}</strong><span>From live listing</span></div></div>
                <p className="review-stars" aria-label="5 star rating">*****</p>
                <p className="review-copy">{review.copy}</p>
                <a className="review-link" href={review.url} target="_blank" rel="noreferrer">View full review</a>
              </article>
            ))}
            <article className="review-card review-open-card reveal-item"><a className="review-open-link" href="https://maps.app.goo.gl/G2eZsAs67ehTDq1V6" target="_blank" rel="noreferrer"><span>Open Reviews</span><small>Google Maps</small></a></article>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
