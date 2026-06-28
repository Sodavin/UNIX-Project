import { useEffect, useState, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';
import OrderCard from './OrderCard';
import NotificationToast from './NotificationToast';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(null);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const pollingIntervalRef = useRef(null);
  const lastFetchTimeRef = useRef(Date.now());
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('authToken');


  // Initial fetch of all orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API}/api/admin/orders/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          setOrders([]);
          setLoading(false);
          return;
        }
        const result = await response.json();
        setOrders(result);
        lastFetchTimeRef.current = Date.now();
      } catch (error) {
        console.error('Admin orders fetch failed', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [API, token]);

  // Polling for new orders every 10 seconds
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

        const newOrderList = await response.json();
        const currentIds = new Set(orders.map(o => o.id));
        const newOrders = newOrderList.filter(o => !currentIds.has(o.id));

        // If new orders found, add them and show notification
        if (newOrders.length > 0) {
          setOrders(prev => [...newOrders, ...prev]); // New orders at top
          setNewOrdersCount(prev => prev + newOrders.length);

          // Show notification for first new order
          const firstNewOrder = newOrders[0];
          setNotification({
            message: `Order #${firstNewOrder.id} from ${firstNewOrder.full_name || 'Customer'}`,
          });

          // Play notification sound (optional)
          try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Silently fail if audio not available
          } catch (e) {
            console.debug('Notification sound not available');
          }
        }
      } catch (error) {
        console.error('Polling for new orders failed:', error);
      }
    };

    pollingIntervalRef.current = setInterval(pollNewOrders, 10000); // Poll every 10 seconds

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [API, token, orders]);

  // Handle order status update from child component
  const handleOrderStatusChange = useCallback((updatedOrder) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  }, []);

  // Handle notification close
  const handleNotificationClose = useCallback(() => {
    setNotification(null);
  }, []);

  // Mark new orders as seen when viewing the page
  const handleMarkAsSeen = useCallback(() => {
    setNewOrdersCount(0);
  }, []);

  const normalizedOrders = orders
    .slice()
    .sort((a, b) => new Date(b.created_at || b.updated_at || '').getTime() - new Date(a.created_at || a.updated_at || '').getTime());

  const filteredOrders = normalizedOrders.filter((order) => {
    const term = search.toLowerCase();
    const customerName = (order.full_name || order.user?.username || 'Customer').toString().toLowerCase();
    const status = (order.status || '').toString().toLowerCase();
    return (
      customerName.includes(term) ||
      String(order.id).includes(term) ||
      status.includes(term)
    );
  });

  const recentOrders = filteredOrders;
  const totalOrders = orders.length;

  return (
    <div className="admin-page admin-orders-page">
      {/* Notification Toast */}
      <NotificationToast notification={notification} onClose={handleNotificationClose} />

      <div className="admin-page-header">
        <div>
          <p className="section-label">Orders</p>
          <h2>All orders {newOrdersCount > 0 && <span className="new-count-badge">{newOrdersCount}</span>}</h2>
        </div>
      </div>

      <div className="admin-filter-row">
        <div className="admin-input-group">
          <Search size={16} />
          <input
            type="search"
            placeholder="Search orders"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={handleMarkAsSeen}
          />
        </div>
      </div>

      <div className="admin-card admin-table-card">
        {loading ? (
          <div className="admin-loading-state">Loading orders...</div>
        ) : recentOrders.length ? (
          <>
            <p className="recent-note">Showing {recentOrders.length} of {totalOrders} orders.</p>
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={handleOrderStatusChange}
                      API={API}
                      token={token}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="admin-empty-state">No orders found.</div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
