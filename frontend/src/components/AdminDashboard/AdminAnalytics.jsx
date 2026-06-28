import { useEffect, useState } from 'react';

function AdminAnalytics() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API}/api/admin/overview/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          setOverview(null);
          setLoading(false);
          return;
        }
        const result = await response.json();
        setOverview(result);
      } catch (error) {
        console.error('Admin analytics fetch failed', error);
        setOverview(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOverview();
  }, [API, token]);

  return (
    <div className="admin-page admin-analytics-page">
      <div className="admin-page-header">
        <div>
          <p className="section-label">Analytics</p>
          <h2>Store insights</h2>
        </div>
      </div>

      <div className="admin-grid admin-metrics-grid">
        {['Revenue', 'Orders', 'Customers', 'Avg order'].map((label, idx) => (
          <div key={label} className="admin-card admin-metric-card">
            <p className="metric-label">{label}</p>
            <p className="metric-value">{loading ? '—' : label === 'Avg order' ? `$${((overview?.total_revenue || 0) / Math.max(overview?.total_orders || 1, 1)).toFixed(2)}` : label === 'Revenue' ? `$${(overview?.total_revenue || 0).toLocaleString()}` : label === 'Orders' ? overview?.total_orders : overview?.total_customers}</p>
          </div>
        ))}
      </div>

      <div className="admin-grid admin-charts-grid">
        <section className="admin-card admin-chart-card">
          <div className="card-header">
            <div>
              <p className="card-title">Monthly sales</p>
            </div>
          </div>
          <div className="chart-summary">
            {loading ? (
              <p>Loading monthly sales data...</p>
            ) : overview?.revenue_trend?.length ? (
              <ul>
                {overview.revenue_trend.map((item) => (
                  <li key={item.month}>
                    <strong>{item.month}:</strong> ${item.revenue.toLocaleString()} from {item.orders} orders
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
              <p className="card-title">Orders by month</p>
            </div>
          </div>
          <div className="chart-summary">
            {loading ? (
              <p>Loading order data...</p>
            ) : overview?.revenue_trend?.length ? (
              <ul>
                {overview.revenue_trend.map((item) => (
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

      <section className="admin-card admin-table-card">
        <div className="card-header">
          <div>
            <p className="card-title">Top products</p>
          </div>
        </div>
        <div className="top-products-list">
          {loading ? (
            <div className="admin-loading-state">Loading top products...</div>
          ) : overview?.top_products?.length ? (
            overview.top_products.map((product) => (
              <div key={product.product_id} className="top-product-item">
                <div>
                  <p className="product-name">{product.name}</p>
                  <p className="product-meta">Sold {product.sold} - ${product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">No top products available.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminAnalytics;
