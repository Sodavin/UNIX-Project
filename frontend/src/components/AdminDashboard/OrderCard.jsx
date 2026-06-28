import React, { useState, useCallback } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ORDER_STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const OrderCard = React.memo(({
  order,
  onStatusChange,
  API,
  token,
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(order);

  const handleStatusChange = useCallback(async (newStatus) => {
    if (!currentOrder) return;
    setUpdatingStatus(true);
    setMessage(null);

    try {
      const response = await fetch(`${API}/api/admin/orders/${currentOrder.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updated = await response.json();
        setCurrentOrder(updated);
        
        // Notify parent of the update
        if (onStatusChange) {
          onStatusChange(updated);
        }

        setMessage({
          type: 'success',
          text: `Status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
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
  }, [currentOrder, API, token, onStatusChange]);

  return (
    <>
      {/* Table Row */}
      <tr onClick={() => setShowDrawer(true)} style={{ cursor: 'pointer' }}>
        <td>#{currentOrder.id}</td>
        <td>{currentOrder.full_name || currentOrder.user?.username || 'Customer'}</td>
        <td>
          {new Date(currentOrder.created_at || currentOrder.updated_at || currentOrder.date || '').toLocaleDateString()}
        </td>
        <td>${Number(currentOrder.total_price ?? 0).toFixed(2)}</td>
        <td className={`status-pill ${currentOrder.status || 'pending'}`}>
          {currentOrder.status || 'Pending'}
        </td>
      </tr>

      {/* Drawer Modal */}
      {showDrawer && (
        <div className="admin-drawer-backdrop" onClick={() => setShowDrawer(false)}>
          <aside className="admin-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Order #{currentOrder.id}</h3>
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowDrawer(false)}
              >
                Close
              </button>
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
              <p>
                <strong>Customer:</strong> {currentOrder.full_name}
              </p>
              <p>
                <strong>Email:</strong> {currentOrder.email}
              </p>
              <p>
                <strong>Phone:</strong> {currentOrder.phone}
              </p>
              <p>
                <strong>Address:</strong> {currentOrder.address}
              </p>

              <div className="drawer-status-field">
                <label>
                  <strong>Status:</strong>
                  <select
                    value={currentOrder.status || 'pending'}
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
                {(currentOrder.items || []).length ? (
                  currentOrder.items.map((item) => (
                    <div
                      key={item.id || `${item.product?.id}-${item.quantity}`}
                      className="drawer-item"
                    >
                      <p>{item.product?.name || 'Unknown product'}</p>
                      <span>
                        {item.quantity || 0} × ${Number(item.price ?? 0).toFixed(2)}
                      </span>
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
    </>
  );
});

OrderCard.displayName = 'OrderCard';

export default OrderCard;
