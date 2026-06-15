import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../css/Hero.css";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1740&q=80",
  "https://c0.wallpaperflare.com/preview/758/70/513/fashion-mens-fashion-suits-groom.jpg",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

function Hero() {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-image">
        {HERO_IMAGES.map((src, idx) => (
          <div
            key={`hero-slide-${idx}`}
            className={`hero-slide-layer ${idx === heroIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
            aria-hidden={idx === heroIndex ? "false" : "true"}
          />
        ))}

        <motion.div
          className="hero-button-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ x: "-50%" }}
        >
          <Link to="/Men-Clothing" className="hero-button">
            MEN
          </Link>
          <Link to="/Women-Clothing" className="hero-button ghost">
            WOMEN
          </Link>
        </motion.div>

        <div className="hero-indicator-row" aria-label="Hero slide indicators">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={`hero-dot-${idx}`}
              type="button"
              className={`hero-indicator ${idx === heroIndex ? "active" : ""}`}
              onClick={() => setHeroIndex(idx)}
              aria-label={`Show image ${idx + 1}`}
              aria-pressed={idx === heroIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
