import { useEffect, useState } from 'react';
import { Search, CheckCircle, AlertCircle } from 'lucide-react';

const ORDER_STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [message, setMessage] = useState(null); // {type: 'success'|'error', text: string}
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('authToken');

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
      } catch (error) {
        console.error('Admin orders fetch failed', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [API, token]);

  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    setMessage(null);
    try {
      const response = await fetch(`${API}/api/admin/orders/${selectedOrder.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const updated = await response.json();
        setSelectedOrder(updated);
        setOrders((prev) =>
          prev.map((order) => (order.id === updated.id ? updated : order))
        );
        setMessage({
          type: 'success',
          text: `Order status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorData = await response.json();
        const errorMsg = errorData?.detail || errorData?.error || 'Failed to update order status';
        console.error('Backend error:', errorData);
        setMessage({
          type: 'error',
          text: errorMsg,
        });
      }
    } catch (error) {
      console.error('Failed to update order status', error);
      setMessage({
        type: 'error',
        text: 'Error updating status: ' + error.message,
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

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

  const recentOrders = filteredOrders.slice(0, 5);
  const totalOrders = orders.length;

  return (
    <div className="admin-page admin-orders-page">
      <div className="admin-page-header">
        <div>
          <p className="section-label">Orders</p>
          <h2>All orders</h2>
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
                    <tr key={order.id} onClick={() => { setSelectedOrder(order); setDrawerOpen(true); }}>
                      <td>#{order.id}</td>
                      <td>{order.full_name || order.user?.username || 'Customer'}</td>
                      <td>{new Date(order.created_at || order.updated_at || order.date || '').toLocaleDateString()}</td>
                      <td>${Number(order.total_price ?? 0).toFixed(2)}</td>
                      <td className={`status-pill ${order.status || 'pending'}`}>{order.status || 'Pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="admin-empty-state">No orders found.</div>
        )}
      </div>

      {drawerOpen && selectedOrder && (
        <div className="admin-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <aside className="admin-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Order #{selectedOrder.id}</h3>
              <button type="button" className="icon-button" onClick={() => setDrawerOpen(false)}>Close</button>
            </div>
            {message && (
              <div className={`drawer-message ${message.type}`}>
                {message.type === 'success' ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                <span>{message.text}</span>
              </div>
            )}
            <div className="drawer-content">
              <p><strong>Customer:</strong> {selectedOrder.full_name}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
              <div className="drawer-status-field">
                <label>
                  <strong>Status:</strong>
                  <select
                    value={selectedOrder.status || 'pending'}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updatingStatus}
                  >
                    {ORDER_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="drawer-items">
                <h4>Items</h4>
                {(selectedOrder.items || []).length ? (
                  selectedOrder.items.map((item) => (
                    <div key={item.id || `${item.product?.id}-${item.quantity}` } className="drawer-item">
                      <p>{item.product?.name || 'Unknown product'}</p>
                      <span>{item.quantity || 0} × ${Number(item.price ?? 0).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <div className="drawer-item">No items available.</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
