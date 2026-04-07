import { useEffect, useRef } from "react";

export default function ReelCard({ src }) {
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
              playPromise.catch(() => {});
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
