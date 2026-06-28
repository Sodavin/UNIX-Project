import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import './adminDashboard.css';

function AdminDashboardLayout({ userName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-dashboard-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-dashboard-panel">
        <AdminTopbar userName={userName} onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        <main className="admin-dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardLayout;
