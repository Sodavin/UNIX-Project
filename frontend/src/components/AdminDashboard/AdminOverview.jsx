import { useEffect, useState } from 'react';
import { Bell, TrendingUp, Box, ShoppingBag, Users, DollarSign, ArrowUpRight, ArrowDownRight, Activity, Clock, AlertCircle } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animatedMetrics, setAnimatedMetrics] = useState(false);
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('authToken');

  // Sample data for when real data is not available
  const getSampleData = () => ({
    total_products: 42,
    total_orders: 156,
    total_customers: 89,
    total_revenue: 12450.75,
    revenue_trend: [
      { month: '2024-01', revenue: 1200, orders: 12 },
      { month: '2024-02', revenue: 1900, orders: 18 },
      { month: '2024-03', revenue: 2200, orders: 22 },
      { month: '2024-04', revenue: 1800, orders: 16 },
      { month: '2024-05', revenue: 2500, orders: 25 },
      { month: '2024-06', revenue: 3250.75, orders: 27 },
    ],
    top_products: [
      { product_id: 1, name: 'Premium T-Shirt', sold: 45, revenue: 1350 },
      { product_id: 2, name: 'Classic Jeans', sold: 38, revenue: 1900 },
      { product_id: 3, name: 'Summer Dress', sold: 32, revenue: 1600 },
      { product_id: 4, name: 'Casual Hoodie', sold: 28, revenue: 1260 },
      { product_id: 5, name: 'Sports Jacket', sold: 13, revenue: 650 },
    ],
    recent_orders: [
      { id: 101, customer_name: 'John Doe', date: '2024-06-25T10:30:00', total_price: 150.50, status: 'delivered' },
      { id: 102, customer_name: 'Jane Smith', date: '2024-06-26T14:15:00', total_price: 299.99, status: 'shipped' },
      { id: 103, customer_name: 'Mike Johnson', date: '2024-06-27T09:45:00', total_price: 89.99, status: 'processing' },
      { id: 104, customer_name: 'Sarah Williams', date: '2024-06-28T16:20:00', total_price: 250.00, status: 'pending' },
      { id: 105, customer_name: 'Tom Brown', date: '2024-06-27T11:00:00', total_price: 175.25, status: 'delivered' },
      { id: 106, customer_name: 'Emma Davis', date: '2024-06-26T13:30:00', total_price: 420.75, status: 'shipped' },
      { id: 107, customer_name: 'David Miller', date: '2024-06-25T15:45:00', total_price: 125.00, status: 'delivered' },
      { id: 108, customer_name: 'Lisa Anderson', date: '2024-06-24T10:15:00', total_price: 310.50, status: 'cancelled' },
    ],
    recent_activity: [
      { message: 'Order #108 moved to cancelled', time: '2024-06-28T14:30:00' },
      { message: 'Order #107 moved to delivered', time: '2024-06-27T10:15:00' },
      { message: 'New customer registered: Emma Davis', time: '2024-06-26T09:20:00' },
      { message: 'Order #104 moved to processing', time: '2024-06-25T14:45:00' },
      { message: 'Product stock updated', time: '2024-06-25T11:30:00' },
      { message: 'New review added to product #5', time: '2024-06-24T16:00:00' },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API}/api/admin/overview/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();
        
        // Ensure we have data, otherwise use sample data
        if (result && result.revenue_trend && result.revenue_trend.length > 0) {
          setData(result);
        } else {
          setData(getSampleData());
          setError('No order data found - displaying sample data');
        }
      } catch (error) {
        console.error('Admin overview fetch failed:', error);
        // Use sample data as fallback
        setData(getSampleData());
        setError('Using sample data - unable to fetch from server');
      } finally {
        setLoading(false);
        setTimeout(() => setAnimatedMetrics(true), 100);
      }
    };

    if (token) fetchData();
  }, [API, token]);

  const metricItems = data
    ? [
        { label: 'Total Products', value: data.total_products, icon: Box, color: 'gradient-indigo', trend: '+12%', positive: true },
        { label: 'Total Orders', value: data.total_orders, icon: ShoppingBag, color: 'gradient-blue', trend: '+8%', positive: true },
        { label: 'Total Customers', value: data.total_customers, icon: Users, color: 'gradient-emerald', trend: '+15%', positive: true },
        { label: 'Total Revenue', value: `$${typeof data.total_revenue === 'number' ? data.total_revenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}`, icon: DollarSign, color: 'gradient-purple', trend: '+23%', positive: true },
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

      {/* Error Alert */}
      {error && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#92400e'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="admin-grid admin-metrics-grid">
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
            {!data || !trendData.length ? (
              <div className="chart-loading">No data available</div>
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
                    formatter={(value) => [`$${typeof value === 'number' ? value.toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00'}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Orders & Status Chart */}
        <div className="admin-cards-stack">
          {/* Orders Trend Chart */}
          <div className="admin-card admin-chart-card">
            <div className="card-header">
              <div>
                <p className="card-title">Orders Trend</p>
                <p className="card-subtitle">Monthly orders count</p>
              </div>
              <ShoppingBag size={20} />
            </div>
            <div className="chart-wrapper">
              {!data || !trendData.length ? (
                <div className="chart-loading">No data available</div>
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

          {/* Order Status Distribution */}
          <div className="admin-card admin-chart-card">
            <div className="card-header">
              <div>
                <p className="card-title">Order Status</p>
                <p className="card-subtitle">Current distribution</p>
              </div>
              <Activity size={20} />
            </div>
            <div className="chart-wrapper chart-wrapper-small">
              {!data || !statusData.length ? (
                <div className="chart-loading">No data available</div>
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
            {recentOrderItems.length ? (
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
              {topProducts.length ? (
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
              {data?.recent_activity?.length ? (
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
