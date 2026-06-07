import {
  Music2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
} from "react-icons/fa";

import "./css/Layout.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* BRAND */}
        <div className="footer-brand">
          <h1>UNIX</h1>

          <p>
            UNIX is a modern fashion store
            bringing you premium quality
            clothing for men and women.
            Style that defines you.
          </p>

          <div className="social-icons">
            <FaInstagram />
            <FaFacebookF />
            <FaTiktok />
          </div>
        </div>

        {/* SHOP */}
        <div className="footer-section">
          <h3>SHOP</h3>

          <Link to="/Men-Clothing">Men</Link>
          <Link to="/Women-Clothing">Women</Link>
        </div>

        {/* CUSTOMER CARE */}
        <div className="footer-section">
          <h3>CUSTOMER CARE</h3>

          <Link to="/contact">Contact Us</Link>
          <a href="#">Shipping & Delivery</a>
          <a href="#">Returns & Exchanges</a>
          <a href="#">FAQs</a>
        </div>

        {/* ABOUT */}
        <div className="footer-section">
          <h3>ABOUT</h3>

          <Link to="/about">About Us</Link>
          <a href="#">Our Stores</a>
          <a href="#">Careers</a>
          <a href="#">News</a>
        </div>

        {/* CONTACT */}
        <div className="footer-section">
          <h3>GET IN TOUCH</h3>

          <div className="contact-item">
            <Mail size={16} />
            <span>support@unix.com</span>
          </div>

          <div className="contact-item">
            <Phone size={16} />
            <span>+855 12 345 678</span>
          </div>

          <div className="contact-item">
            <MapPin size={16} />
            <span>Phnom Penh, Cambodia</span>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© 2025 UNIX. All rights reserved.</p>

        <div className="payment-icons">
          <div className="payment-box">VISA</div>
          <div className="payment-box">MC</div>
          <div className="payment-box">ABA</div>
          <div className="payment-box">PayPal</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;