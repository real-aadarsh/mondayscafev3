import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import EventsPopup from "./components/EventsPopup";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useRevealOnScroll } from "./hooks/useRevealOnScroll";
import EventsPage from "./pages/EventsPage";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import ReservePage from "./pages/ReservePage";

export default function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useRevealOnScroll(location.pathname);

  useEffect(() => {
    document.body.classList.add("page-ready");
    return () => document.body.classList.remove("page-ready");
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 720) setMenuOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
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

  return (
    <>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} isScrolled={isScrolled} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/reserve" element={<ReservePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <EventsPopup />
    </>
  );
}
