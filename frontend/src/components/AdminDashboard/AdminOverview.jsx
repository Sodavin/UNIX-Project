import { useEffect, useState } from 'react';
import { Bell, TrendingUp, Box, ShoppingBag, Users, DollarSign } from 'lucide-react';

function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API}/api/admin/overview/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          setData(null);
          setLoading(false);
          return;
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Admin overview fetch failed', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [API, token]);

  const metricItems = data
    ? [
        { label: 'Total Products', value: data.total_products, icon: Box, color: 'indigo' },
        { label: 'Total Orders', value: data.total_orders, icon: ShoppingBag, color: 'blue' },
        { label: 'Total Customers', value: data.total_customers, icon: Users, color: 'emerald' },
        { label: 'Total Revenue', value: `$${data.total_revenue.toLocaleString()}`, icon: DollarSign, color: 'slate' },
      ]
    : [];

  return (
    <div className="admin-overview-page">
      <div className="admin-overview-header">
        <div>
          <p className="section-label">Overview</p>
          <h2>Store performance</h2>
        </div>
        <button type="button" className="admin-action-btn">
          <Bell size={16} />
          Notifications
        </button>
      </div>

      <div className="admin-grid admin-metrics-grid">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="admin-card admin-card-loading" />
            ))
          : metricItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="admin-card admin-metric-card">
                  <div className={`metric-icon metric-icon-${item.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="metric-label">{item.label}</p>
                    <p className="metric-value">{item.value}</p>
                  </div>
                </div>
              );
            })}
      </div>

      <div className="admin-grid admin-charts-grid">
        <section className="admin-card admin-chart-card">
          <div className="card-header">
            <div>
              <p className="card-title">Revenue trend</p>
              <p className="card-subtitle">Last 12 months</p>
            </div>
            <TrendingUp size={18} />
          </div>
          <div className="chart-wrapper">
            {loading ? (
              <div className="chart-loading">Loading revenue trend...</div>
            ) : data?.revenue_trend?.length ? (
              <ul className="admin-data-list">
                {data.revenue_trend.map((item) => (
                  <li key={item.month}>
                    <strong>{item.month}:</strong> ${item.revenue.toLocaleString()} revenue
                  </li>
                ))}
              </ul>
            ) : (
              <p>No revenue trend data available.</p>
            )}
          </div>
        </section>

        <section className="admin-card admin-chart-card">
          <div className="card-header">
            <div>
              <p className="card-title">Orders trend</p>
              <p className="card-subtitle">Recent months</p>
            </div>
            <ShoppingBag size={18} />
          </div>
          <div className="chart-wrapper">
            {loading ? (
              <div className="chart-loading">Loading orders trend...</div>
            ) : data?.revenue_trend?.length ? (
              <ul className="admin-data-list">
                {data.revenue_trend.map((item) => (
                  <li key={`orders-${item.month}`}>
                    <strong>{item.month}:</strong> {item.orders} orders
                  </li>
                ))}
              </ul>
            ) : (
              <p>No orders trend data available.</p>
            )}
          </div>
        </section>
      </div>

      <div className="admin-grid admin-lists-grid">
        <section className="admin-card admin-table-card">
          <div className="card-header">
            <div>
              <p className="card-title">Recent orders</p>
              <p className="card-subtitle">Latest activity in the store</p>
            </div>
          </div>
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
                {loading || !data ? (
                  <tr>
                    <td colSpan="5" className="loading-row">Loading orders...</td>
                  </tr>
                ) : data.recent_orders.length ? (
                  data.recent_orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer_name}</td>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td>${order.total_price.toFixed(2)}</td>
                      <td className="status-badge">{order.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-row">No orders available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-card admin-activity-card">
          <div className="card-header">
            <div>
              <p className="card-title">Recent activity</p>
              <p className="card-subtitle">Keep track of updates</p>
            </div>
          </div>
          <div className="activity-list">
            {loading || !data ? (
              <div className="activity-loading">Loading activity...</div>
            ) : data.recent_activity.length ? (
              data.recent_activity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <p>{activity.message}</p>
                  <span>{new Date(activity.time).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="empty-state">No activity yet</p>
            )}
          </div>
        </section>
      </div>

      <section className="admin-card admin-top-products-card">
        <div className="card-header">
          <div>
            <p className="card-title">Top-selling products</p>
            <p className="card-subtitle">Most popular items</p>
          </div>
        </div>
        <div className="top-products-list">
          {loading || !data ? (
            <div className="top-products-loading">Loading products...</div>
          ) : data.top_products.length ? (
            data.top_products.map((product) => (
              <div key={product.product_id} className="top-product-item">
                <div>
                  <p className="product-name">{product.name}</p>
                  <p className="product-meta">Sold {product.sold} • ${product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">No top products yet</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminOverview;
