import { useMemo, useState } from "react";
import { menuCatalog } from "../data/siteData";

const categories = ["All", ...new Set(menuCatalog.map((item) => item.category))];

export default function MenuPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState("all");

  const tags = useMemo(() => {
    const unique = new Set();
    menuCatalog.forEach((item) => item.tags.forEach((t) => unique.add(t)));
    return ["all", ...unique];
  }, []);

  const filtered = useMemo(() => {
    return menuCatalog.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesTag = tag === "all" || item.tags.includes(tag);
      const q = query.trim().toLowerCase();
      const matchesQuery = q.length === 0 || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      return matchesCategory && matchesTag && matchesQuery;
    });
  }, [category, query, tag]);

  return (
    <main className="route-main">
      <section className="section route-hero reveal-item">
        <div className="container">
          <p className="eyebrow">Curated Selection</p>
          <h1 className="route-title">Signature Menu</h1>
          <p className="route-copy">Discover pairings by style, mood, and time with a refined menu experience.</p>
        </div>
      </section>

      <section className="section">
        <div className="container menu-search-wrap reveal-item">
          <input
            className="menu-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search dishes, drinks, or vibes"
          />

          <div className="chip-row">
            {categories.map((item) => (
              <button key={item} className={`chip ${category === item ? "is-active" : ""}`} type="button" onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="chip-row">
            {tags.map((item) => (
              <button key={item} className={`chip ${tag === item ? "is-active" : ""}`} type="button" onClick={() => setTag(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="container menu-grid route-grid">
          {filtered.map((item) => (
            <article key={`${item.name}-${item.category}`} className="menu-item-card reveal-item">
              <div className="menu-item-top">
                <h3>{item.name}</h3>
                <span>{item.price}</span>
              </div>
              <p className="menu-item-cat">{item.category}</p>
              <p>{item.description}</p>
              <div className="menu-tags">
                {item.tags.map((pill) => (
                  <small key={pill}>{pill}</small>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
