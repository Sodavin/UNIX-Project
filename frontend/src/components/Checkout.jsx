import React, { useState, useEffect } from "react";
import "./css/Checkout.css";
import "./css/ProductGrid.css";
import { FaTelegramPlane, FaPhone, FaWhatsapp, FaTrash } from "react-icons/fa";
import Receipt from "./Receipt";
import qrCodeImage from "./static/QRCode/QR.jpg";

const Checkout = () => {
  const [payment, setPayment] = useState("ABA PAY");
  const [deliveryOption, setDeliveryOption] = useState("Virak Buntham");
  const [contact, setContact] = useState("Telegram");
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [contactValue, setContactValue] = useState("");
  const [contactError, setContactError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);

  // Slide-over drawer visibility states
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

  const orderData = {
    orderNumber: "UNX-" + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    delivery: {
      provider: deliveryOption,
      timeframe: "2-3 days",
    },
    items: cartItems.map((item) => ({
      name: item.name,
      qty: item.quantity || 1,
      price: Number(item.price),
      image: item.image,
    })),
    paymentMethod: payment,
    contact: {
      type: contact,
      value: contactValue,
    },
    pricing: {
      subtotal: total,
      save: 0.0,
      deliveryFee: 0.0,
      total: total,
    },
  };

  const payments = [
    {
      name: "ABA PAY",
      image:
        "https://play-lh.googleusercontent.com/WU6sZMD1UspzwqYnlACtmN60rckp8hoINSgsR21mKLJBbsHPwXtzwvOocpjC7FcO1g",
      desc: "Scan to pay with ABA Mobile",
      qrImage: qrCodeImage,
    },
    {
      name: "ACLEDA PAY",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM37KLHTgu31C4LMRGMBzIu7QwwJXVeOC-EA&s",
      desc: "Pay securely with ACLEDA",
      qrImage: qrCodeImage,
    },
    {
      name: "Wing Bank",
      image:
        "https://www.vivathgolden-financeplc.com.kh/uploads/partner_photo_1709190768.png",
      desc: "Pay securely with WingPay",
      qrImage: qrCodeImage,
    },
    {
      name: "CHIP MONG BANK",
      image:
        "https://cdn.aptoide.com/imgs/5/f/f/5ff160dae543a6bf549a64d26bf19c02_icon.png",
      desc: "Tap to pay with CHIP MONG",
      qrImage: qrCodeImage,
    },
  ];

  const selectedPaymentObj = payments.find((p) => p.name === payment);

  // FLOW CONTROL: Triggered when user clicks main "Checkout" button
  const handleCheckoutClick = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!contactValue.trim()) {
      setContactError("Please enter your contact information.");
      return;
    }

    setContactError("");

    if (selectedPaymentObj && selectedPaymentObj.qrImage) {
      setIsQrOpen(true);
    } else {
      confirmAndPlaceOrder();
    }
  };

  // Finalizes transaction states and switches layout view to Receipt component
  const confirmAndPlaceOrder = () => {
    const completedOrder = {
      ...orderData,
    };

    setReceiptData(completedOrder);

    localStorage.removeItem("cart");

    setIsQrOpen(false);
    setIsAddressOpen(false);

    setCartItems([]);
    setOrderPlaced(true);
  };

  const handleBackToStore = () => {
    setOrderPlaced(false);
    setReceiptData(null);
  };

  if (orderPlaced) {
    return (
      <Receipt orderData={receiptData} onBackToStore={handleBackToStore} />
    );
  }

  return (
    <div className="checkout-container">
      {/* LEFT SECTION */}
      <div className="left-section">
        <div className="card">
          <h2>Delivery Address</h2>
          <button
            className="address-btn"
            onClick={() => setIsAddressOpen(true)}
          >
            Add Your Address →
          </button>

          <div
            className={`delivery-option ${deliveryOption === "Virak Buntham" ? "selected" : ""}`}
            onClick={() => setDeliveryOption("Virak Buntham")}
          >
            <input
              type="radio"
              name="delivery"
              checked={deliveryOption === "Virak Buntham"}
              readOnly
            />
            <img
              src="https://vireakbuntham.com/img/vireak-buntham.3087fdaf.png"
              alt="Virak Buntham"
            />
            <div>
              <h4>Virak Buntham</h4>
              <p>Delivery within 2-3 days.</p>
            </div>
          </div>
          <hr />
          <div
            className={`delivery-option ${deliveryOption === "ZTO" ? "selected" : ""}`}
            onClick={() => setDeliveryOption("ZTO")}
          >
            <input
              type="radio"
              name="delivery"
              checked={deliveryOption === "ZTO"}
              readOnly
            />
            <img
              src="https://play-lh.googleusercontent.com/CCAGbVdFeug05MAPe9QfP7JQ2aWvWyRLiXkQLlmAig1DR-1ptcxKNi6vc0v7xbAJHS0"
              alt="ZTO"
            />
            <div>
              <h4>ZTO</h4>
              <p>Delivery within 2-3 days.</p>
            </div>
          </div>
        </div>

        {/* SHOPPING BAG */}
        <div className="card">
          <h2>My Shopping Bag ({cartItems.length})</h2>
          {cartItems.length === 0 ? (
            <p>Your shopping bag is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div className="product" key={index}>
                <img className="product-img" src={item.image} alt={item.name} />
                <div className="product-info">
                  <h3>{item.name}</h3>
                  <p>Quantity x 1</p>
                </div>
                <div className="product-actions">
                  <div className="price">US ${item.price}</div>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        {/* PAYMENT LIST */}
        <div className="card">
          <h2>Payment</h2>
          <div className="payment-options-list">
            {payments.map((item) => (
              <div
                key={item.name}
                className={`payment-item ${payment === item.name ? "selected" : ""}`}
                onClick={() => setPayment(item.name)}
              >
                <input type="radio" checked={payment === item.name} readOnly />
                <img
                  src={item.image}
                  alt={item.name}
                  className="payment-logo"
                />
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div className="card">
          <h2>Preferred Contact Line</h2>

          <div className="contact-buttons">
            <button
              className={contact === "Phone" ? "active" : ""}
              onClick={() => setContact("Phone")}
            >
              <FaPhone /> Phone
            </button>

            <button
              className={contact === "Telegram" ? "active" : ""}
              onClick={() => setContact("Telegram")}
            >
              <FaTelegramPlane /> Telegram
            </button>

            <button
              className={contact === "WhatsApp" ? "active" : ""}
              onClick={() => setContact("WhatsApp")}
            >
              <FaWhatsapp /> WhatsApp
            </button>
          </div>

          <label className="contact-label">
            {contact === "Phone"
              ? "Phone Number"
              : contact === "Telegram"
                ? "Telegram Username"
                : "WhatsApp Number"}
          </label>

          <input
            type="text"
            className="input"
            value={contactValue}
            onChange={(e) => {
              setContactValue(e.target.value);
              setContactError("");
            }}
            placeholder={
              contact === "Phone"
                ? "Enter Phone Number"
                : contact === "Telegram"
                  ? "Enter Telegram Username"
                  : "Enter WhatsApp Number"
            }
          />

          {contactError && (
            <p style={{ color: "red", marginTop: "5px", fontSize: "14px" }}>
              {contactError}
            </p>
          )}
        </div>

        {/* TOTAL BOX */}
        <div className="card total-box">
          <div className="row">
            <span>Total</span>
            <span>AMK ${total.toFixed(2)}</span>
          </div>
          <div className="row">
            <span>Save</span>
            <span>US $0.00</span>
          </div>
          <div className="row">
            <span>Delivery Fee</span>
            <span>US $0.00</span>
          </div>
          <hr />
          <div className="row amount">
            <span>Amount to Pay</span>
            <span>US ${total.toFixed(2)}</span>
          </div>
          {/* Main button routes through conditional validation flow */}
          <button className="checkout-btn" onClick={handleCheckoutClick}>
            Pay Now
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* GLOBAL DRAWER BACKGROUND OVERLAY           */}
      {/* ========================================== */}
      <div
        className={`address-overlay ${isAddressOpen || isQrOpen ? "visible" : ""}`}
        onClick={() => {
          setIsAddressOpen(false);
          setIsQrOpen(false);
        }}
      />

      {/* ========================================== */}
      {/* SLIDE-OVER 1: ADDRESS BOOK                 */}
      {/* ========================================== */}
      <div className={`address-sidebar ${isAddressOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button
            className="close-sidebar-btn"
            onClick={() => setIsAddressOpen(false)}
          >
            ←
          </button>
          <h3>Address book</h3>
        </div>
        <div className="sidebar-content">
          <div className="form-group">
            <label>Recipient Name</label>
            <input type="text" placeholder="Name" className="input" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" placeholder="Phone Number" className="input" />
          </div>
          <div className="form-group">
            <label>Province / City</label>
            <input
              type="text"
              placeholder="Your province or city"
              className="input"
            />
          </div>
          <div className="form-group">
            <label>Detailed Address</label>
            <textarea
              placeholder="House No, Street No, Sangkat, Khan..."
              className="textarea"
            />
          </div>
        </div>
        <div className="sidebar-footer">
          <button
            className="add-new-address-btn"
            onClick={() => setIsAddressOpen(false)}
          >
            Add new address
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* SLIDE-OVER 2: QR ENTRY TO RECEIPT FLOW     */}
      {/* ========================================== */}
      <div className={`address-sidebar ${isQrOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button
            className="close-sidebar-btn"
            onClick={() => setIsQrOpen(false)}
          >
            ←
          </button>
          <h3>Payment QR Code</h3>
          <p className="countdown">
            Expires in: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </p>
        </div>

        <div className="sidebar-content qr-sidebar-layout">
          {selectedPaymentObj && selectedPaymentObj.qrImage && (
            <div className="sidebar-qr-container">
              <p className="sidebar-qr-title">
                Scan to Pay via <strong>{selectedPaymentObj.name}</strong>
              </p>
              <img
                src={selectedPaymentObj.qrImage}
                alt={`${selectedPaymentObj.name} QR Code`}
                className="sidebar-qr-img"
              />
              <span className="sidebar-qr-instruction">
                Open your mobile banking application to scan the hub code image
                securely.
              </span>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          {/* Confirms payment action and loads layout view to your Receipt design panel */}
          <button
            className="add-new-address-btn"
            onClick={confirmAndPlaceOrder}
          >
            Confirm Payment & Finish
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default Checkout;
