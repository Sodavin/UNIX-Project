import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Checkout.css";
import "./css/ProductGrid.css";
import { FaTelegramPlane, FaPhone, FaWhatsapp, FaTrash } from "react-icons/fa";
import Receipt from "./Receipt";
import qrCodeImage from "./static/QRCode/QR.jpg";
import { useCart } from "./cart/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // All hooks MUST be declared before any conditional returns
  const [payment, setPayment] = useState("ABA PAY");
  const [deliveryOption, setDeliveryOption] = useState("Virak Buntham");
  const [contact, setContact] = useState("Telegram");
  const { items: cartItems, removeItem: removeCartItem, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [contactValue, setContactValue] = useState("");
  const [contactError, setContactError] = useState("");
  const [timeLeft] = useState(300);
  
  // Address form hooks
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [provinceCity, setProvinceCity] = useState("");
  const [provinceSearch, setProvinceSearch] = useState("");
  const [showProvinceMenu, setShowProvinceMenu] = useState(false);
  const [district, setDistrict] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [addressErrorMessage, setAddressErrorMessage] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const provinceMenuRef = useRef(null);

  const token = (() => {
    const t = localStorage.getItem('authToken');
    return t && t.trim() !== '' && t.trim().toLowerCase() !== 'null' && t.trim().toLowerCase() !== 'undefined' ? t.trim() : null;
  })();

  useEffect(() => {
    if (!token) {
      navigate('/login?next=/Checkout', { replace: true });
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API}/api/user/addresses/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) return [];
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSavedAddresses(data);
          return;
        }

        // Fallback to user profile address when no address book entries exist yet.
        return fetch(`${API}/api/user/profile/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
      })
      .then(async (response) => {
        if (!response || !response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (!data) return;
        const profile = data.profile || {};
        const existingAddress = {
          id: null,
          recipient_name: data.first_name || data.username || '',
          phone: profile.phone || '',
          province_city: profile.province_city || '',
          district: profile.district || '',
          address_details: profile.address_details || '',
        };

        if (existingAddress.address_details || existingAddress.phone || existingAddress.province_city || existingAddress.district) {
          setSavedAddresses((prev) => (prev.length > 0 ? prev : [existingAddress]));
        }
      })
      .catch((error) => {
        console.error('Failed to load saved addresses', error);
      });
  }, [API, token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (provinceMenuRef.current && !provinceMenuRef.current.contains(event.target)) {
        setShowProvinceMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Now we can do conditional returns - all hooks are already called
  if (!token) {
    return null;
  }

  const provinces = [
    "Phnom Penh",
    "Banteay Meanchey",
    "Battambang",
    "Kampong Cham",
    "Kampong Chhnang",
    "Kampong Speu",
    "Kampong Thom",
    "Kampot",
    "Kandal",
    "Kep",
    "Koh Kong",
    "Kratie",
    "Mondulkiri",
    "Oddar Meanchey",
    "Pailin",
    "Preah Sihanouk",
    "Preah Vihear",
    "Pursat",
    "Prey Veng",
    "Ratanakiri",
    "Siem Reap",
    "Stung Treng",
    "Svay Rieng",
    "Takeo",
    "Tboung Khmum",
  ];

  const provinceDistricts = {
    "Phnom Penh": [
      "Chamkar Mon",
      "Doun Penh",
      "Prampir Meakkakra",
      "Tuol Kork",
      "Sen Sok",
      "Russey Keo",
      "Chbar Ampov",
      "Mean Chey",
      "Dangkor",
      "Por Sen Chey",
      "Chroy Changvar",
      "Prek Pnov",
      "Kamboul",
      "Boeng Keng Kang",
    ],
    "Banteay Meanchey": ["Serei Saophoan", "Poipet", "Mongkol Borei", "Preah Netr Preah"],
    "Battambang": ["Battambang Municipality", "Thma Koul", "Sangke", "Bavel"],
    "Kampong Cham": ["Kampong Cham Municipality", "Chamkar Leu", "Kampong Siem", "Prey Chhor"],
    "Kampong Chhnang": ["Kampong Chhnang Municipality", "Kampong Tralach", "Rolea B'ier", "Chol Kiri"],
    "Kampong Speu": ["Chbar Mon", "Samrong Tong", "Kong Pisei", "Teuk Chhou"],
    "Kampong Thom": ["Stoung", "Santuk", "Baray", "Kampong Svay"],
    "Kampot": ["Kampot Municipality", "Chhuk", "Doun Kaev", "Angkor Chey"],
    "Kandal": ["Ta Khmau", "Kien Svay", "Lvea Aem", "Ang Snoul"],
    "Kep": ["Kep Municipality", "Damnak Chang'aeur"],
    "Koh Kong": ["Koh Kong Municipality", "Sre Ambel", "Kiri Sakor", "Mondol Seima"],
    "Kratie": ["Kratie Municipality", "Chhloung", "Sambour", "Preaek Prasab"],
    "Mondulkiri": ["Sen Monorom", "Kaev Seima", "O'Yadav"],
    "Oddar Meanchey": ["Samraong", "Banteay Ampil", "Anlong Veng"],
    "Pailin": ["Pailin Municipality", "Sala Krau", "Pebas"],
    "Preah Sihanouk": ["Sihanoukville Municipality", "Prey Nob", "Stueng Hav"],
    "Preah Vihear": ["Preah Vihear Municipality", "Chheb", "Rovieng"],
    "Pursat": ["Pursat Municipality", "Krakor", "Bakan"],
    "Prey Veng": ["Prey Veng Municipality", "Peam Ro", "Svay Antor"],
    "Ratanakiri": ["Banlung", "Lumphat", "Oyadav"],
    "Siem Reap": ["Siem Reap Municipality", "Angkor Thom", "Puok"],
    "Stung Treng": ["Stung Treng Municipality", "Siem Pang", "Sesan"],
    "Svay Rieng": ["Svay Rieng Municipality", "Bavet", "Svay Chrum"],
    "Takeo": ["Takeo Municipality", "Daun Keo", "Tram Kak"],
    "Tboung Khmum": ["Suong", "Memot", "Dambae"],
  };

  const filteredProvinces = provinces.filter((province) =>
    province.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  const districtOptions = provinceDistricts[provinceCity] || [];

  const validateAddressForm = () => {
    const errors = {};

    if (!recipientName.trim()) {
      errors.recipientName = "Recipient name is required.";
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required.";
    }

    if (!provinceCity) {
      errors.provinceCity = "Province / City is required.";
    }

    if (!district) {
      errors.district = "District / Khan is required.";
    }

    if (!addressDetails.trim()) {
      errors.addressDetails = "Detailed address is required.";
    }

    return errors;
  };

  const handleSaveAddress = () => {
    const errors = validateAddressForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setAddressErrorMessage("Please complete the delivery address before saving.");
      return;
    }

    setAddressErrorMessage("");
    setIsAddressOpen(false);
  };

  const handleSelectSavedAddress = (address) => {
    if (!address) return;

    setRecipientName(address.recipient_name || address.recipientName || '');
    setPhoneNumber(address.phone || address.phoneNumber || '');
    setProvinceCity(address.province_city || address.provinceCity || '');
    setProvinceSearch(address.province_city || address.provinceCity || '');
    setDistrict(address.district || '');
    setAddressDetails(address.address_details || address.addressDetails || '');
    setFormErrors({});
    setAddressErrorMessage("");
    setSelectedAddressId(address.id || null);
    setIsAddressOpen(false);
  };

  // cartItems are provided by CartContext; no local hydration needed here

  const removeItem = (index) => {
    const product = cartItems[index];
    if (product) removeCartItem(product);
  };

  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);

  const orderData = {
    orderNumber: "UNX-" + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
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
      size: item.size || null,
      color: item.color || null,
    })),
    paymentMethod: payment,
    contact: {
      type: contact,
      value: contactValue,
    },
    address: {
      recipientName,
      phoneNumber,
      provinceCity,
      district,
      addressDetails,
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

    const addressErrors = validateAddressForm();
    setFormErrors(addressErrors);

    if (Object.keys(addressErrors).length > 0) {
      setAddressErrorMessage("Please select or complete the delivery address before confirming payment.");
      return;
    }

    setAddressErrorMessage("");

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
      savedAt: new Date().toISOString(),
    };

    setReceiptData(completedOrder);

    // Save order to localStorage
    try {
      const existingOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      existingOrders.unshift(completedOrder); // Add to beginning (newest first)
      localStorage.setItem('orderHistory', JSON.stringify(existingOrders));
    } catch (error) {
      console.error('Failed to save order to localStorage', error);
    }

    // clear cart from context/storage
    clearCart();

    setIsQrOpen(false);
    setIsAddressOpen(false);

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
          <p className="checkout-warning">
            A delivery address is required to confirm payment. Please add a new address or use your saved account address.
          </p>
          {savedAddresses.length > 0 && (
            <div className="saved-address-list">
              <p className="saved-address-label">Saved account address book</p>
              {savedAddresses.map((address) => (
                <div key={address.id || `${address.province_city}-${address.phone}`} className={`saved-address-card ${selectedAddressId === address.id ? 'selected' : ''}`}>
                  <div className="saved-address-copy">
                    <strong>{address.recipient_name || address.recipientName}</strong>
                    <p>{address.phone || address.phoneNumber}</p>
                    <p>{address.province_city || address.provinceCity}{(address.district || '') ? `, ${address.district}` : ''}</p>
                    <p>{address.address_details || address.addressDetails}</p>
                  </div>
                  <button
                    type="button"
                    className={`use-saved-address-btn ${selectedAddressId === address.id ? 'selected' : ''}`}
                    onClick={() => handleSelectSavedAddress(address)}
                    aria-pressed={selectedAddressId === address.id}
                  >
                    {selectedAddressId === address.id ? 'Selected' : 'Use Address'}
                  </button>
                </div>
              ))}
            </div>
          )}
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
                  <p>
                    Quantity: {item.quantity || 1}
                    {item.size ? ` | Size: ${item.size}` : ""}
                    {item.color ? ` | Color: ${item.color}` : ""}
                  </p>
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
          {addressErrorMessage && (
            <p className="checkout-error-message">{addressErrorMessage}</p>
          )}
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
          <h3>Add delivery address</h3>
        </div>
        <div className="sidebar-content">
          <div className="form-group">
            <label>Recipient Name <span className="field-required">*</span></label>
            <input
              type="text"
              placeholder="Name"
              className={`input ${formErrors.recipientName ? "input-error" : ""}`}
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
            {formErrors.recipientName && <p className="field-error-text">{formErrors.recipientName}</p>}
          </div>

          <div className="form-group">
            <label>Phone Number <span className="field-required">*</span></label>
            <input
              type="tel"
              placeholder="Phone Number"
              className={`input ${formErrors.phoneNumber ? "input-error" : ""}`}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {formErrors.phoneNumber && <p className="field-error-text">{formErrors.phoneNumber}</p>}
          </div>

          <div className="form-group" ref={provinceMenuRef}>
            <label>Province / City <span className="field-required">*</span></label>
            <div className={`search-dropdown ${formErrors.provinceCity ? "input-error" : ""} ${showProvinceMenu ? "open" : ""}`}>
              <input
                type="text"
                placeholder="Select Province / City"
                value={provinceSearch}
                onChange={(e) => {
                  setProvinceSearch(e.target.value);
                  setShowProvinceMenu(true);
                }}
                onFocus={() => setShowProvinceMenu(true)}
                className="input"
              />
              <button
                type="button"
                className={`caret-btn ${showProvinceMenu ? "open" : ""}`}
                onClick={() => setShowProvinceMenu((s) => !s)}
                aria-label="Toggle province list"
                aria-expanded={showProvinceMenu}
                aria-controls="province-menu"
              >
                <svg className="caret-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {showProvinceMenu && (
                <div id="province-menu" className="dropdown-menu">
                  {filteredProvinces.length > 0 ? (
                    filteredProvinces.map((province) => (
                      <button
                        key={province}
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          setProvinceCity(province);
                          setProvinceSearch(province);
                          setShowProvinceMenu(false);
                          setDistrict("");
                        }}
                      >
                        {province}
                      </button>
                    ))
                  ) : (
                    <div className="dropdown-empty">No provinces found.</div>
                  )}
                </div>
              )}
            </div>
            {formErrors.provinceCity && <p className="field-error-text">{formErrors.provinceCity}</p>}
          </div>

          <div className="form-group">
            <label>District / Khan <span className="field-required">*</span></label>
            <select
              className={`input ${formErrors.district ? "input-error" : ""}`}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!provinceCity}
            >
              <option value="">{provinceCity ? "Select District / Khan" : "Choose province first"}</option>
              {districtOptions.map((districtOption) => (
                <option key={districtOption} value={districtOption}>
                  {districtOption}
                </option>
              ))}
            </select>
            {formErrors.district && <p className="field-error-text">{formErrors.district}</p>}
          </div>

          <div className="form-group">
            <label>Detailed Address <span className="field-required">*</span></label>
            <textarea
              placeholder="House No, Street No, Sangkat, Khan, Landmark..."
              className={`textarea ${formErrors.addressDetails ? "input-error" : ""}`}
              value={addressDetails}
              onChange={(e) => setAddressDetails(e.target.value)}
            />
            {formErrors.addressDetails && <p className="field-error-text">{formErrors.addressDetails}</p>}
          </div>
        </div>
        <div className="sidebar-footer">
          <button
            className="add-new-address-btn"
            onClick={handleSaveAddress}
          >
            Save Address
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
