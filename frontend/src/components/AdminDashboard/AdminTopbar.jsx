import { Bell, User, Menu } from 'lucide-react';

function AdminTopbar({ userName, onMenuToggle }) {
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
        <button type="button" className="admin-topbar-icon-btn" aria-label="Notifications">
          <Bell size={18} />
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
