import React, { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import "./css/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Message submitted successfully!");

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <h1>CONTACT US</h1>
        <p>We're here to help and answer any questions you may have.</p>

        <a
          href="https://t.me/vanthorn27"
          target="_blank"
          rel="noopener noreferrer"
          className="telegram-btn"
        >
          <FaTelegramPlane />
          Chat on Telegram
        </a>
      </div>

      {/* Contact Content */}
      <div className="contact-container">
        {/* Contact Info */}
        <div className="contact-info">
          <h2>Get In Touch</h2>

          <div className="info-item">
            <strong>Email</strong>
            <p>support@unix.com</p>
          </div>

          <div className="info-item">
            <strong>Phone</strong>
            <p>+855 12 345 678</p>
          </div>

          <div className="info-item">
            <strong>Location</strong>
            <p>Phnom Penh, Cambodia</p>
          </div>
        </div>

        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <textarea
            rows="6"
            name="message"
            placeholder="Write your message..."
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Send Message</button>
        </form>
        
      </div>
      {/* Google Map */}
<div className="map-wrapper">
  <h2>Our Location</h2>

  <iframe
    title="UNIX Location"
    src="https://maps.google.com/maps?q=Phnom%20Penh%20Cambodia&t=&z=13&ie=UTF8&iwloc=&output=embed"
    loading="lazy"
    allowFullScreen
  />
</div>

    </div>
  );
};

export default Contact;