import { useEffect, useState } from "react";
import "./css/BackToTop.css";

function BackToTop({ threshold = 300 }) {
  const [visible, setVisible] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      try {
        setVisible(window.scrollY > threshold);
        
        // Check if button is near footer
        const footer = document.querySelector('footer');
        if (footer) {
          const footerRect = footer.getBoundingClientRect();
          setAtFooter(footerRect.top <= window.innerHeight && footerRect.top > 0);
        }
      } catch (e) {
        // ignore in non-browser environments
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const handleClick = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch (e) {
      // fallback
      window.scrollTo(0, 0);
    }
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      className={`back-to-top ${visible ? "visible" : ""} ${atFooter ? "at-footer" : ""}`}
      onClick={handleClick}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  );
}

export default BackToTop;
