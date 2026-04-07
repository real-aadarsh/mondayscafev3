export default function Footer() {
  return (
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
                <a href="https://www.instagram.com/mondayscafewpg/" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://linktr.ee/mondays" target="_blank" rel="noreferrer">Linktree</a>
                <a href="https://maps.app.goo.gl/G2eZsAs67ehTDq1V6" target="_blank" rel="noreferrer">Google Maps</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} MondaysCafe. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
