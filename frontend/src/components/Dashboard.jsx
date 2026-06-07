import React from 'react';
import { LayoutDashboard, ShoppingBag, Heart, LogOut, User } from 'lucide-react';
import './Dashboard.css';

function Dashboard({ setView, setIsLoggedIn, userName, setUserName, userEmail, setUserEmail }) {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('home');
  };

  return (
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
            <div className="welcome-banner">
              <h1>Hello, {userName} 👋</h1>
              <p>Welcome to your account dashboard.</p>
            </div>

            <div className="dashboard-cards">
              <div className="dashboard-card orders" onClick={() => setActiveTab('orders')}>
                <ShoppingBag size={32} />
                <h3>Orders</h3>
                <p>Track your orders</p>
              </div>
              
              <div className="dashboard-card wishlist" onClick={() => setActiveTab('wishlist')}>
                <Heart size={32} />
                <h3>Wishlist</h3>
                <p>Saved products</p>
              </div>
              
              <div className="dashboard-card profile" onClick={() => setActiveTab('profile')}>
                <User size={32} />
                <h3>Profile</h3>
                <p>Manage account</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <div className="profile-settings-card">
            <h2>Profile Settings</h2>
            <p className="profile-subtitle">Update your account information.</p>
            
            <form className="profile-form" onSubmit={(e) => { e.preventDefault(); alert("Profile updated!"); }}>
              <div className="form-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Phone Number</label>
                  <input type="text" placeholder="+1 234 567 890" />
                </div>
                <div className="input-group">
                  <label>Location</label>
                  <input type="text" placeholder="City, Country" />
                </div>
              </div>

              <button type="submit" className="save-btn">Save Changes</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
