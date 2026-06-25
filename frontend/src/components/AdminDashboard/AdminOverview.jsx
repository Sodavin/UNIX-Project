import { useEffect, useState } from 'react';
import { Bell, TrendingUp, Box, ShoppingBag, Users, DollarSign, ArrowUpRight, ArrowDownRight, Activity, Clock } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatedMetrics, setAnimatedMetrics] = useState(false);
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
        setLoading(false);
        // Trigger animations after data loads
        setTimeout(() => setAnimatedMetrics(true), 100);
      } catch (error) {
        console.error('Admin overview fetch failed', error);
        setData(null);
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [API, token]);

  const metricItems = data
    ? [
        { label: 'Total Products', value: data.total_products, icon: Box, color: 'gradient-indigo', trend: '+12%', positive: true },
        { label: 'Total Orders', value: data.total_orders, icon: ShoppingBag, color: 'gradient-blue', trend: '+8%', positive: true },
        { label: 'Total Customers', value: data.total_customers, icon: Users, color: 'gradient-emerald', trend: '+15%', positive: true },
        { label: 'Total Revenue', value: `$${data.total_revenue.toLocaleString()}`, icon: DollarSign, color: 'gradient-purple', trend: '+23%', positive: true },
      ]
    : [];

  const trendData = data?.revenue_trend || [];
  const recentOrderItems = data?.recent_orders?.slice(0, 8) || [];
  const topProducts = data?.top_products?.slice(0, 5) || [];
  const notifications = data?.recent_orders?.length || 0;

  // Prepare chart colors
  const chartColors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // Status distribution data
  const statusData = recentOrderItems.reduce((acc, order) => {
    const status = order.status || 'pending';
    const existing = acc.find(item => item.name === status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="admin-overview-page">
      {/* Header Section */}
      <div className="admin-overview-header">
        <div>
          <p className="section-label">Dashboard</p>
          <h2>Welcome back, Admin</h2>
          <p className="section-description">Here's an overview of your store's performance</p>
        </div>
        <button type="button" className="admin-notification-btn">
          <Bell size={18} />
          <span className="notification-badge">{notifications > 0 ? notifications : 0}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="admin-metrics-grid">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="admin-card admin-card-loading" />
            ))
          : metricItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.label} 
                  className={`admin-card admin-metric-card ${item.color} ${animatedMetrics ? 'animate-card-in' : ''}`}
                  style={{
                    animation: animatedMetrics ? `slideInUp 0.5s ease-out ${index * 0.1}s both` : 'none'
                  }}
                >
                  <div className="metric-header">
                    <div className="metric-icon">
                      <Icon size={22} />
                    </div>
                    <div className={`metric-trend ${item.positive ? 'positive' : 'negative'}`}>
                      {item.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      <span>{item.trend}</span>
                    </div>
                  </div>
                  <div className="metric-content">
                    <p className="metric-label">{item.label}</p>
                    <p className="metric-value">{item.value}</p>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Charts Section */}
      <div className="admin-charts-container">
        {/* Revenue Chart */}
        <div className="admin-card admin-chart-card">
          <div className="card-header">
            <div>
              <p className="card-title">Revenue Overview</p>
              <p className="card-subtitle">Monthly revenue trend</p>
            </div>
            <TrendingUp size={20} />
          </div>
          <div className="chart-wrapper">
            {loading || !trendData.length ? (
              <div className="chart-loading">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Orders & Status Chart */}
        <div className="admin-cards-stack">
          <div className="admin-card admin-chart-card">
            <div className="card-header">
              <div>
                <p className="card-title">Orders Trend</p>
                <p className="card-subtitle">Last 12 months</p>
              </div>
              <ShoppingBag size={20} />
            </div>
            <div className="chart-wrapper">
              {loading || !trendData.length ? (
                <div className="chart-loading">Loading chart...</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      formatter={(value) => [value, 'Orders']}
                    />
                    <Bar dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="admin-card admin-chart-card">
            <div className="card-header">
              <div>
                <p className="card-title">Order Status</p>
                <p className="card-subtitle">Distribution</p>
              </div>
              <Activity size={20} />
            </div>
            <div className="chart-wrapper chart-wrapper-small">
              {loading || !statusData.length ? (
                <div className="chart-loading">Loading chart...</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="admin-data-section">
        {/* Recent Orders */}
        <div className="admin-card admin-table-card">
          <div className="card-header">
            <div>
              <p className="card-title">Recent Orders</p>
              <p className="card-subtitle">Latest 8 orders</p>
            </div>
            <ShoppingBag size={20} />
          </div>
          <div className="responsive-table">
            {loading ? (
              <div className="table-loading">Loading orders...</div>
            ) : recentOrderItems.length ? (
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrderItems.map((order) => (
                    <tr key={order.id} className="table-row-hover">
                      <td className="table-cell-strong">#{order.id}</td>
                      <td>{order.customer_name || order.user?.username || 'Customer'}</td>
                      <td className="text-muted">
                        <Clock size={14} style={{ marginRight: '6px' }} />
                        {new Date(order.date || order.created_at || order.updated_at || '').toLocaleDateString()}
                      </td>
                      <td className="table-cell-strong">${Number(order.total_price ?? 0).toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${(order.status || 'pending').toLowerCase()}`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">No orders yet</div>
            )}
          </div>
        </div>

        {/* Two Column Layout for Top Products and Activity */}
        <div className="admin-two-column">
          {/* Top Selling Products */}
          <div className="admin-card admin-products-card">
            <div className="card-header">
              <div>
                <p className="card-title">Top Selling Products</p>
                <p className="card-subtitle">Best performers</p>
              </div>
              <Box size={20} />
            </div>
            <div className="products-list">
              {loading ? (
                <div className="products-loading">Loading products...</div>
              ) : topProducts.length ? (
                topProducts.map((product, index) => (
                  <div key={product.product_id} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-info">
                      <p className="product-name">{product.name}</p>
                      <p className="product-meta">Sold: {product.sold} • Revenue: ${Number(product.revenue ?? 0).toFixed(2)}</p>
                    </div>
                    <div className="product-revenue">${Number(product.revenue ?? 0).toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No products yet</div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="admin-card admin-activity-card">
            <div className="card-header">
              <div>
                <p className="card-title">Recent Activity</p>
                <p className="card-subtitle">Latest updates</p>
              </div>
              <Activity size={20} />
            </div>
            <div className="activity-feed">
              {loading ? (
                <div className="activity-loading">Loading activity...</div>
              ) : data?.recent_activity?.length ? (
                data.recent_activity.map((activity, index) => (
                  <div key={index} className="activity-item-modern">
                    <div className="activity-dot"></div>
                    <div className="activity-content">
                      <p className="activity-message">{activity.message}</p>
                      <span className="activity-timestamp">{new Date(activity.time).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No activity yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
