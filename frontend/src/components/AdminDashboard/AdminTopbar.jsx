import { useEffect, useState, useRef } from 'react';
import { Bell, User, Menu } from 'lucide-react';

function AdminTopbar({ userName, onMenuToggle }) {
  const [ setOrderCount] = useState(0);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const pollingIntervalRef = useRef(null);
  const lastCheckTimeRef = useRef(Date.now());
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
  }, [API, setOrderCount, token]);

  // Poll for new orders
  useEffect(() => {
    if (!token) return;

    const pollNewOrders = async () => {
      try {
        const response = await fetch(`${API}/api/admin/orders/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) return;

        const orderList = await response.json();
        const now = Date.now();
        const lastCheck = lastCheckTimeRef.current;
        
        // Count orders created in the last check interval (with 2 second buffer)
        const recentOrders = orderList.filter(order => {
          const orderTime = new Date(order.created_at || order.updated_at || '').getTime();
          return orderTime > (lastCheck - 2000);
        });

        if (recentOrders.length > 0) {
          setNewOrdersCount(recentOrders.length);
          setHasNewOrders(true);
        }

        lastCheckTimeRef.current = now;
      } catch (error) {
        console.error('Polling for new orders failed:', error);
      }
    };

    // Poll every 5 seconds
    pollingIntervalRef.current = setInterval(pollNewOrders, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [API, token]);

  const handleNotificationClick = () => {
    setHasNewOrders(false);
    setNewOrdersCount(0);
  };

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
        <button 
          type="button" 
          className="admin-topbar-icon-btn" 
          aria-label="Notifications"
          onClick={handleNotificationClick}
        >
          <Bell size={18} />
          {hasNewOrders && (
            <>
              <span className={`notification-badge ${hasNewOrders ? 'pulse' : ''}`} />
              <span className="notification-count">{newOrdersCount}</span>
            </>
          )}
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
