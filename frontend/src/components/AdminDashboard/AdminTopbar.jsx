import { useEffect, useState } from 'react';
import { Bell, User, Menu } from 'lucide-react';

function AdminTopbar({ userName, onMenuToggle }) {
  const [orderCount, setOrderCount] = useState(0);
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await fetch(`${API}/api/admin/overview/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) return;
        const result = await response.json();
        setOrderCount(result.recent_orders?.length || result.total_orders || 0);
      } catch (error) {
        console.error('Failed to load admin notifications', error);
      }
    };

    if (token) fetchOverview();
  }, [API, token]);

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button type="button" className="admin-menu-button" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>
        <div>
          <p className="admin-welcome">Welcome back,</p>
          <h1 className="admin-welcome-name">{userName || 'Admin'}</h1>
        </div>
      </div>

      <div className="admin-topbar-actions">
        <button type="button" className="admin-topbar-icon-btn" aria-label="Notifications">
          <Bell size={18} />
          {orderCount > 0 && <span className="notification-badge" />}
        </button>
        <button type="button" className="admin-profile-btn">
          <User size={18} />
          <span>{userName ? userName.split(' ')[0] : 'Admin'}</span>
        </button>
      </div>
    </header>
  );
}

export default AdminTopbar;
