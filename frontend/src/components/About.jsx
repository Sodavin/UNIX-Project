import React from "react";
import "./css/About.css";

const About = () => {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <div className="about-hero">
        <h1>ABOUT UNIX</h1>
        <p>
          Premium fashion crafted for confidence, comfort, and modern living.
        </p>
      </div>

      <div className="about-container">

        {/* Our Story */}
        <section className="about-section">
          <h2>Who We Are</h2>

          <p>
            UNIX is a modern fashion brand dedicated to delivering premium
            clothing for men and women. We combine contemporary design,
            exceptional quality, and affordable luxury to help our customers
            express their unique style.
          </p>

          <p>
            Our collections are carefully curated to bring together comfort,
            elegance, and the latest fashion trends. Whether you're dressing
            for work, casual outings, or special occasions, UNIX has something
            designed for you.
          </p>
        </section>

        {/* Mission */}
        <section className="about-section">
          <h2>Our Mission</h2>

          <p>
            To provide fashionable, comfortable, and high-quality apparel that
            inspires confidence and empowers people to look their best every
            day.
          </p>
        </section>

        {/* Features */}
        <div className="about-grid">

          <div className="about-card">
            <h3>Quality</h3>

            <p>
              Carefully selected fabrics and attention to every detail to
              ensure long-lasting quality.
            </p>
          </div>

          <div className="about-card">
            <h3>Style</h3>

            <p>
              Trend-driven collections designed for modern lifestyles and
              fashion-forward individuals.
            </p>
          </div>

          <div className="about-card">
            <h3>Customer First</h3>

            <p>
              Exceptional shopping experiences both online and offline with
              dedicated customer support.
            </p>
          </div>

        </div>

        {/* Why Choose Us */}
        <section className="about-section">
          <h2>Why Choose UNIX?</h2>

          <div className="why-box">
            <ul>
              <li>✓ Premium Quality Materials</li>
              <li>✓ Modern Fashion Collections</li>
              <li>✓ Fast Shipping & Delivery</li>
              <li>✓ Easy Returns & Exchanges</li>
              <li>✓ Affordable Luxury</li>
              <li>✓ Trusted Customer Support</li>
            </ul>
          </div>
        </section>

        {/* Statistics */}
        <div className="stats">

          <div className="stat-box">
            <h2>5000+</h2>
            <p>Happy Customers</p>
          </div>

          <div className="stat-box">
            <h2>200+</h2>
            <p>Fashion Products</p>
          </div>

          <div className="stat-box">
            <h2>98%</h2>
            <p>Customer Satisfaction</p>
          </div>

          <div className="stat-box">
            <h2>24/7</h2>
            <p>Customer Support</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default About;