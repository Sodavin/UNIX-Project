import React from 'react'
import { useEffect, useState } from "react";
import "./css/HeroSlider.css";

const slides = [
  {
    id: 1,
    title: "MEGA CLEARANCE",
    discount: "-80%",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    bg: "#FFD600",
  },
  {
    id: 2,
    title: "NEW ARRIVALS",
    discount: "-60%",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
    bg: "#00C2FF",
  },
  {
    id: 3,
    title: "SUMMER SALE",
    discount: "-50%",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    bg: "#FF6B6B",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  // AUTO SLIDE
  useEffect(() => {
    const slider = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(slider);
  }, []);

  return (
    <div
      className="hero-slider"
      style={{ background: slides[current].bg }}
    >
      <div className="hero-content">
        {/* LEFT */}
        <div className="hero-left">
          <p className="small-title">
            {slides[current].title}
          </p>

          <h1>{slides[current].discount}</h1>

          <button>SHOP NOW</button>
        </div>

        {/* RIGHT */}
        <div className="hero-right">
          <img
            src={slides[current].image}
            alt=""
          />
        </div>
      </div>

      {/* DOTS */}
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={current === index ? "dot active" : "dot"}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}