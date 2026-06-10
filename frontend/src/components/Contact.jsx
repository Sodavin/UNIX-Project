import React, { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { capitalizeWords } from "../utils/stringUtils";
import { usePageTitle } from "../utils/usePageTitle";
import "./css/Contact.css";

const Contact = () => {
  usePageTitle("UNIX | Contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "name"
          ? capitalizeWords(e.target.value)
          : e.target.value,
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
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.725082606304!2d104.88666231093755!3d11.571555288582294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109519e617fd2ad%3A0xf2d7ba03bf4d9285!2sWestern%20University%20Main%20Campus!5e0!3m2!1sen!2skh!4v1780975837937!5m2!1sen!2skh"
    loading="lazy"
    allowFullScreen
  />
</div>

    </div>
  );
};

export default Contact;