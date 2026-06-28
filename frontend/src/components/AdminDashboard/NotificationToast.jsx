import React, { useEffect } from 'react';
import { Bell, X } from 'lucide-react';

const NotificationToast = React.memo(({ notification, onClose }) => {
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="notification-toast">
      <div className="notification-content">
        <Bell size={20} className="notification-icon" />
        <div className="notification-text">
          <p className="notification-title">New Order!</p>
          <p className="notification-message">{notification.message}</p>
        </div>
      </div>
      <button
        type="button"
        className="notification-close"
        onClick={onClose}
      >
        <X size={16} />
      </button>
    </div>
  );
});

NotificationToast.displayName = 'NotificationToast';

export default NotificationToast;
