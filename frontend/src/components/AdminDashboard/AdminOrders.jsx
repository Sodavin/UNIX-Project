import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const filteredOrders = orders.filter((order) => {
    const term = search.toLowerCase();
    return (
      order.full_name.toLowerCase().includes(term) ||
      String(order.id).includes(term) ||
      order.status.toLowerCase().includes(term)
    );
  });

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
        ) : filteredOrders.length ? (
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
                {filteredOrders.map((order) => (
                  <tr key={order.id} onClick={() => { setSelectedOrder(order); setDrawerOpen(true); }}>
                    <td>#{order.id}</td>
                    <td>{order.full_name}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>${order.total_price.toFixed(2)}</td>
                    <td className={`status-pill ${order.status}`}>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            <div className="drawer-content">
              <p><strong>Customer:</strong> {selectedOrder.full_name}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <div className="drawer-items">
                <h4>Items</h4>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="drawer-item">
                    <p>{item.product?.name || 'Unknown product'}</p>
                    <span>{item.quantity} × ${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
