import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Heart, LogOut, User, X } from 'lucide-react';
import { useWishlist } from './WishlistContext';
import { capitalizeWords } from '../utils/stringUtils';
import { usePageTitle } from '../utils/usePageTitle';
import ProductsCard from './ProductsCard';
import Receipt from './Receipt';
import './css/Dashboard.css';

function Dashboard({ setView, setIsLoggedIn, userName, setUserName, userEmail, setUserEmail }) {
  usePageTitle('UNIX | Dashboard');
  const navigate = useNavigate();
  const { itemCount: wishlistCount, items: wishlistItems } = useWishlist();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [orders, setOrders] = React.useState([]);
  const [selectedReceipt, setSelectedReceipt] = React.useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provinceCity, setProvinceCity] = useState('');
  const [provinceSearch, setProvinceSearch] = useState('');
  const [showProvinceMenu, setShowProvinceMenu] = useState(false);
  const [district, setDistrict] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [profileMessage, setProfileMessage] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressBookMessage, setAddressBookMessage] = useState('');
  const [addressBookError, setAddressBookError] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const provinceMenuRef = useRef(null);
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const token = (() => {
    const t = localStorage.getItem('authToken');
    return t && t.trim() !== '' && t.trim().toLowerCase() !== 'null' && t.trim().toLowerCase() !== 'undefined' ? t.trim() : null;
  })();

  // Load orders for the signed-in user from the backend
  React.useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API}/api/user/orders/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          setOrders([]);
          return;
        }

        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load user orders', error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [API, token]);

  const ordersCount = orders.length;
  const profileUpdates = 2;
  const welcomeTitle = userName ? capitalizeWords(userName).split(' ')[0] : 'User';

  const provinces = [
    'Phnom Penh',
    'Banteay Meanchey',
    'Battambang',
    'Kampong Cham',
    'Kampong Chhnang',
    'Kampong Speu',
    'Kampong Thom',
    'Kampot',
    'Kandal',
    'Kep',
    'Koh Kong',
    'Kratie',
    'Mondulkiri',
    'Oddar Meanchey',
    'Pailin',
    'Preah Sihanouk',
    'Preah Vihear',
    'Pursat',
    'Prey Veng',
    'Ratanakiri',
    'Siem Reap',
    'Stung Treng',
    'Svay Rieng',
    'Takeo',
    'Tboung Khmum',
  ];

  const provinceDistricts = {
    'Phnom Penh': [
      'Chamkar Mon',
      'Doun Penh',
      'Prampir Meakkakra',
      'Tuol Kork',
      'Sen Sok',
      'Russey Keo',
      'Chbar Ampov',
      'Mean Chey',
      'Dangkor',
      'Por Sen Chey',
      'Chroy Changvar',
      'Prek Pnov',
      'Kamboul',
      'Boeng Keng Kang',
    ],
    'Banteay Meanchey': ['Serei Saophoan', 'Poipet', 'Mongkol Borei', 'Preah Netr Preah'],
    'Battambang': ['Battambang Municipality', 'Thma Koul', 'Sangke', 'Bavel'],
    'Kampong Cham': ['Kampong Cham Municipality', 'Chamkar Leu', 'Kampong Siem', 'Prey Chhor'],
    'Kampong Chhnang': ['Kampong Chhnang Municipality', 'Kampong Tralach', "Rolea B'ier", 'Chol Kiri'],
    'Kampong Speu': ['Chbar Mon', 'Samrong Tong', 'Kong Pisei', 'Teuk Chhou'],
    'Kampong Thom': ['Stoung', 'Santuk', 'Baray', 'Kampong Svay'],
    'Kampot': ['Kampot Municipality', 'Chhuk', 'Doun Kaev', 'Angkor Chey'],
    'Kandal': ['Ta Khmau', 'Kien Svay', 'Lvea Aem', 'Ang Snoul'],
    'Kep': ['Kep Municipality', "Damnak Chang'aeur"],
    'Koh Kong': ['Koh Kong Municipality', 'Sre Ambel', 'Kiri Sakor', 'Mondol Seima'],
    'Kratie': ['Kratie Municipality', 'Chhloung', 'Sambour', 'Preaek Prasab'],
    'Mondulkiri': ['Sen Monorom', 'Kaev Seima', "O'Yadav"],
    'Oddar Meanchey': ['Samraong', 'Banteay Ampil', 'Anlong Veng'],
    'Pailin': ['Pailin Municipality', 'Sala Krau', 'Pebas'],
    'Preah Sihanouk': ['Sihanoukville Municipality', 'Prey Nob', 'Stueng Hav'],
    'Preah Vihear': ['Preah Vihear Municipality', 'Chheb', 'Rovieng'],
    'Pursat': ['Pursat Municipality', 'Krakor', 'Bakan'],
    'Prey Veng': ['Prey Veng Municipality', 'Peam Ro', 'Svay Antor'],
    'Ratanakiri': ['Banlung', 'Lumphat', 'Oyadav'],
    'Siem Reap': ['Siem Reap Municipality', 'Angkor Thom', 'Puok'],
    'Stung Treng': ['Stung Treng Municipality', 'Siem Pang', 'Sesan'],
    'Svay Rieng': ['Svay Rieng Municipality', 'Bavet', 'Svay Chrum'],
    'Takeo': ['Takeo Municipality', 'Daun Keo', 'Tram Kak'],
    'Tboung Khmum': ['Suong', 'Memot', 'Dambae'],
  };

  const filteredProvinces = provinces.filter((province) =>
    province.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/user/profile/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json();
        return data;
      })
      .then((data) => {
        if (!data) return;
        const profile = data.profile || {};
        if (data.first_name) setUserName(capitalizeWords(data.first_name));
        else if (data.username) setUserName(data.username);
        if (data.email) setUserEmail(data.email);
        setPhoneNumber(profile.phone || '');
        setProvinceCity(profile.province_city || '');
        setProvinceSearch(profile.province_city || '');
        setDistrict(profile.district || '');
        setAddressDetails(profile.address_details || '');
      })
      .catch((error) => {
        console.error('Failed to load profile address', error);
      });
  }, [API, token, setUserEmail, setUserName]);

  useEffect(() => {
    if (!token) return;

    setIsLoadingAddresses(true);
    fetch(`${API}/api/user/addresses/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    })
      .then(async (response) => {
        setIsLoadingAddresses(false);
        if (!response.ok) throw new Error('Failed to load saved addresses');
        return response.json();
      })
      .then((data) => {
        setSavedAddresses(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        setIsLoadingAddresses(false);
        console.error('Failed to load saved addresses', error);
      });
  }, [API, token]);

  const validateProfileForm = () => {
    const errors = {};

    if (!userName.trim()) {
      errors.fullName = 'Full name is required.';
    }
    if (!userEmail.trim()) {
      errors.userEmail = 'Email address is required.';
    }
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required.';
    }
    if (!provinceCity) {
      errors.provinceCity = 'Province / City is required.';
    }
    if (!district) {
      errors.district = 'District / Khan is required.';
    }
    if (!addressDetails.trim()) {
      errors.addressDetails = 'Detailed address is required.';
    }

    return errors;
  };

  const validateAddressBookEntry = () => {
    const errors = {};

    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required.';
    }
    if (!provinceCity) {
      errors.provinceCity = 'Province / City is required.';
    }
    if (!district) {
      errors.district = 'District / Khan is required.';
    }
    if (!addressDetails.trim()) {
      errors.addressDetails = 'Detailed address is required.';
    }

    return errors;
  };

  const handleAddSavedAddress = async () => {
    setAddressBookError(false);
    setAddressBookMessage('');
    const errors = validateAddressBookEntry();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setAddressBookError(true);
      setAddressBookMessage('Please complete the address fields before saving.');
      return;
    }

    if (!token) {
      setAddressBookError(true);
      setAddressBookMessage('You must be logged in to save saved addresses.');
      return;
    }

    try {
      const response = await fetch(`${API}/api/user/addresses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          recipient_name: userName,
          phone: phoneNumber,
          province_city: provinceCity,
          district,
          address_details: addressDetails,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setAddressBookError(true);
        setAddressBookMessage(data.detail || 'Unable to save address.');
        return;
      }

      setSavedAddresses((prev) => [data, ...prev]);
      setAddressBookError(false);
      setAddressBookMessage('Address added to your saved address book.');
    } catch (error) {
      console.error('Failed to save address', error);
      setAddressBookError(true);
      setAddressBookMessage('Unable to save address.');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!token) return;
    setAddressBookError(false);
    setAddressBookMessage('');

    if (!window.confirm('Delete this saved address?')) {
      return;
    }

    try {
      const response = await fetch(`${API}/api/user/addresses/${addressId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        setAddressBookError(true);
        setAddressBookMessage('Unable to delete address.');
        return;
      }

      setSavedAddresses((prev) => prev.filter((address) => address.id !== addressId));
      setAddressBookError(false);
      setAddressBookMessage('Saved address removed.');
    } catch (error) {
      console.error('Failed to delete address', error);
      setAddressBookError(true);
      setAddressBookMessage('Unable to delete address.');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    const errors = validateProfileForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    if (!token) {
      setProfileMessage('You must be logged in to update your profile.');
      return;
    }

    try {
      const response = await fetch(`${API}/api/user/profile/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          first_name: userName,
          email: userEmail,
          profile: {
            phone: phoneNumber,
            province_city: provinceCity,
            district,
            address_details: addressDetails,
          },
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setProfileMessage(data.detail || 'Unable to update profile.');
        return;
      }

      setProfileMessage('Profile settings and address were saved successfully.');
      if (data.first_name && setUserName) setUserName(data.first_name);
      if (data.email && setUserEmail) setUserEmail(data.email);
    } catch (error) {
      console.error('Profile update failed', error);
      setProfileMessage('Unable to reach the server.');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch(`${API}/api/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error', error);
    }

    localStorage.removeItem('authToken');
    window.dispatchEvent(new Event('authChanged'));
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');

    if (typeof setView === 'function') {
      setView('home');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2>My Account</h2>
        <ul>
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}><LayoutDashboard size={18} /> Dashboard</li>
          <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}><ShoppingBag size={18} /> Orders</li>
          <li className={activeTab === 'wishlist' ? 'active' : ''} onClick={() => setActiveTab('wishlist')}><Heart size={18} /> Wishlist</li>
          <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}><User size={18} /> Profile</li>
          <li className="logout" onClick={handleLogout}><LogOut size={18} /> Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'dashboard' && (
          <>
            <div className="dashboard-topbar">
              <div>
                <p className="dashboard-subtitle">Account Overview</p>
                <h1>Hi, {welcomeTitle}</h1>
                <p className="dashboard-intro">Your UNIX project dashboard gives you quick access to orders, wishlist, profile settings and project status.</p>
              </div>
              <div className="dashboard-status-card">
                <span>Account Status</span>
                <strong>Active</strong>
              </div>
            </div>

            <div className="dashboard-summary-grid">
              <div className="dashboard-card orders" onClick={() => setActiveTab('orders')}>
                <div className="dashboard-card-header">
                  <ShoppingBag size={32} />
                  <span className="dashboard-card-count">{ordersCount}</span>
                </div>
                <h3>Orders</h3>
                <p>Track your latest purchases and shipping status.</p>
              </div>
              
              <div className="dashboard-card wishlist" onClick={() => setActiveTab('wishlist')}>
                <div className="dashboard-card-header">
                  <Heart size={32} />
                  <span className="dashboard-card-count">{wishlistCount}</span>
                </div>
                <h3>Wishlist</h3>
                <p>View saved products and favorites.</p>
              </div>
              
              <div className="dashboard-card profile" onClick={() => setActiveTab('profile')}>
                <div className="dashboard-card-header">
                  <User size={32} />
                </div>
                <h3>Profile</h3>
                <p>Manage account details and contact info.</p>
              </div>
            </div>

            <div className="dashboard-detail-grid">
              <section className="dashboard-info-card">
                <h2>Important project details</h2>
                <ul>
                  <li>Orders: check current status and history.</li>
                  <li>Wishlist: keep products ready for checkout.</li>
                  <li>Profile: update your email, name, and contact data.</li>
                </ul>
              </section>
              <section className="dashboard-info-card dashboard-quick-actions">
                <h2>Quick actions</h2>
                <button type="button" onClick={() => setActiveTab('orders')}>Open Orders</button>
                <button type="button" onClick={() => setActiveTab('wishlist')}>See Wishlist</button>
                <button type="button" onClick={() => setActiveTab('profile')}>Edit Profile</button>
              </section>
            </div>

            <section className="dashboard-info-card dashboard-activity-card">
              <h2>Recent activity</h2>
              <ul className="activity-list">
                <li>
                  <span className="activity-time">2 days ago</span>
                  <strong>Order #UNX-291384</strong> moved to shipping.
                </li>
                <li>
                  <span className="activity-time">4 days ago</span>
                  <strong>Wishlist item added</strong> — Summer Linen Top.
                </li>
                <li>
                  <span className="activity-time">1 week ago</span>
                  <strong>Profile updated</strong> — contact preferences refreshed.
                </li>
              </ul>
            </section>
          </>
        )}

        {activeTab === 'orders' && !selectedReceipt && (
          <section className="dashboard-info-card">
            <h2>Order history</h2>
            <p className="dashboard-intro">Click any order to view its full receipt.</p>
            {orders.length === 0 ? (
              <p>No orders yet. Start shopping to see your order history here.</p>
            ) : (
              <div className="dashboard-orders-list">
                {orders.map((order) => {
                  const orderNumber = order.id ? `UNX-${String(order.id).padStart(6, '0')}` : 'UNX-000000';
                  const parsedDate = order.created_at ? new Date(order.created_at) : null;
                  const orderDate = parsedDate && !Number.isNaN(parsedDate.getTime())
                    ? parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                    : 'No date available';
                  const orderTotal = typeof order.total_price === 'number'
                    ? `$${order.total_price.toFixed(2)}`
                    : order.total_price
                      ? `$${Number(order.total_price).toFixed(2)}`
                      : '$0.00';
                  const rawStatus = (order.status || '').toString().trim().toLowerCase();
                  const orderStatus = rawStatus === 'pending'
                    ? 'Pending'
                    : rawStatus === 'payment_successful' || rawStatus === 'paid'
                      ? 'Payment Successful'
                      : rawStatus === 'completed'
                        ? 'Completed'
                        : rawStatus
                          ? rawStatus.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
                          : 'Pending';
                  
                  return (
                    <div
                      key={orderNumber}
                      className="order-row"
                      onClick={() => setSelectedReceipt(order)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedReceipt(order)}
                    >
                      <div>
                        <strong>{orderNumber}</strong>
                        <p>{orderDate}</p>
                      </div>
                      <div>
                        <span className={`order-status order-${orderStatus.toLowerCase()}`}>{orderStatus}</span>
                        <strong>{orderTotal}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === 'orders' && selectedReceipt && (
          <div className="dashboard-receipt-modal">
            <button
              className="dashboard-receipt-close"
              type="button"
              onClick={() => setSelectedReceipt(null)}
              aria-label="Close receipt"
            >
              <X size={20} />
            </button>
            <Receipt
              orderData={selectedReceipt}
              onBackToStore={() => setSelectedReceipt(null)}
            />
          </div>
        )}

        {activeTab === 'wishlist' && (
          <section>
            <h2 style={{ marginBottom: '10px', fontSize: '28px', color: '#0f172a' }}>Wishlist items</h2>
            <p className="dashboard-intro">These items are stored locally in your wishlist.</p>
            {wishlistItems.length === 0 ? (
              <p>No wishlist items yet.</p>
            ) : (
              <div className="dashboard-wishlist-products-grid">
                {wishlistItems.map((item) => (
                  <ProductsCard
                    key={item.id}
                    product={item}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'profile' && (
          <div className="profile-settings-card">
            <h2>Profile Settings</h2>
            <p className="profile-subtitle">Update your account information.</p>
            
            <form className="profile-form" onSubmit={handleProfileSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className={`input ${formErrors.fullName ? 'input-error' : ''}`}
                    value={userName}
                    onChange={(e) => setUserName(capitalizeWords(e.target.value))}
                    required
                  />
                  {formErrors.fullName && <p className="field-error-text">{formErrors.fullName}</p>}
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className={`input ${formErrors.userEmail ? 'input-error' : ''}`}
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                  {formErrors.userEmail && <p className="field-error-text">{formErrors.userEmail}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className={`input ${formErrors.phoneNumber ? 'input-error' : ''}`}
                    placeholder="+855 1234 5678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  {formErrors.phoneNumber && <p className="field-error-text">{formErrors.phoneNumber}</p>}
                </div>

                <div className="form-group" ref={provinceMenuRef}>
                  <label>Province / City</label>
                  <div className={`search-dropdown ${formErrors.provinceCity ? 'input-error' : ''} ${showProvinceMenu ? 'open' : ''}`}>
                    <input
                      type="text"
                      className="input"
                      placeholder="Select Province / City"
                      value={provinceSearch}
                      onChange={(e) => {
                        setProvinceSearch(e.target.value);
                        setShowProvinceMenu(true);
                      }}
                      onFocus={() => setShowProvinceMenu(true)}
                    />
                    <button
                      type="button"
                      className={`caret-btn ${showProvinceMenu ? 'open' : ''}`}
                      onClick={() => setShowProvinceMenu((s) => !s)}
                      aria-label="Toggle province list"
                      aria-expanded={showProvinceMenu}
                    >
                      <svg className="caret-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {showProvinceMenu && (
                      <div className="dropdown-menu">
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
                                setDistrict('');
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>District / Khan</label>
                  <select
                    className={`input ${formErrors.district ? 'input-error' : ''}`}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={!provinceCity}
                    required
                  >
                    <option value="">{provinceCity ? 'Select District / Khan' : 'Choose province first'}</option>
                    {provinceDistricts[provinceCity]?.map((districtOption) => (
                      <option key={districtOption} value={districtOption}>
                        {districtOption}
                      </option>
                    ))}
                  </select>
                  {formErrors.district && <p className="field-error-text">{formErrors.district}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Detailed Address</label>
                  <textarea
                    className={`textarea ${formErrors.addressDetails ? 'input-error' : ''}`}
                    placeholder="House No, Street No, Sangkat, Khan, Landmark..."
                    value={addressDetails}
                    onChange={(e) => setAddressDetails(e.target.value)}
                    required
                  />
                  {formErrors.addressDetails && <p className="field-error-text">{formErrors.addressDetails}</p>}
                </div>
              </div>

              <div className="profile-action-row">
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" className="save-address-btn" onClick={handleAddSavedAddress}>Save Address to Book</button>
              </div>
              {profileMessage && <p className="success-text">{profileMessage}</p>}
              {addressBookMessage && (
                <p className={addressBookError ? 'error-text' : 'success-text'}>{addressBookMessage}</p>
              )}
            </form>

            <div className="address-book-card">
              <div className="address-book-header">
                <h3>Saved Addresses</h3>
                {isLoadingAddresses && <span className="loading-text">Loading addresses...</span>}
              </div>
              {savedAddresses.length === 0 ? (
                <p className="empty-text">No saved addresses yet. Add one using the address fields above.</p>
              ) : (
                savedAddresses.map((address) => (
                  <div key={address.id} className="saved-address-entry">
                    <div className="saved-address-copy">
                      <strong>{address.recipient_name || userName}</strong>
                      <p>{address.phone}</p>
                      <p>{address.province_city}{address.district ? `, ${address.district}` : ''}</p>
                      <p>{address.address_details}</p>
                    </div>
                    <button
                      type="button"
                      className="delete-address-btn"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  </div>
  );
}

export default Dashboard;
