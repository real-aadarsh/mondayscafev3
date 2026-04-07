import { useEffect } from "react";

export function useRevealOnScroll(dependency) {
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll(".reveal-item"));
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
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
  }, [dependency]);
}
