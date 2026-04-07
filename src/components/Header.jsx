import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/events", label: "Events" },
  { to: "/reserve", label: "Reserve" },
];

export default function Header({ menuOpen, setMenuOpen, isScrolled }) {
  return (
    <header className={`site-header ${menuOpen ? "menu-open" : ""} ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="container nav-wrap">
        <NavLink className="brand" to="/" onClick={() => setMenuOpen(false)}>
          MONDAYS <span className="brand-script">cafe</span>
        </NavLink>

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
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "is-active" : "")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
