import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, ShoppingBag, Users, BarChart3, Settings, ChevronLeft } from 'lucide-react';

const items = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: Box },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

function AdminSidebar({ open, onClose }) {
  const location = useLocation();

  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        <div>
          <p className="admin-brand-label">UNIX Admin</p>
          <p className="admin-brand-subtitle">Store management</p>
        </div>
        <button type="button" className="sidebar-close-btn" onClick={onClose}>
          <ChevronLeft size={18} />
        </button>
      </div>

      <nav className="admin-sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} className="sidebar-icon" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
