import React from 'react';
import { CheckCircle, Copy, ArrowLeft, Printer, ShoppingBag } from 'lucide-react';
import './css/Receipt.css';

export default function Receipt({ orderData, onBackToStore }) {
  const data = orderData || {
    orderNumber: 'UNX-' + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    delivery: {
      provider: 'Virak Buntham',
      timeframe: '2-3 days',
    },
    items: [
      {
        name: 'Elegant Dress',
        qty: 1,
        price: 44.99,
        image: 'https://via.placeholder.com/60',
      },
    ],
    paymentMethod: 'ABA PAY (Scan to Pay)',
    contact: {
      type: 'Telegram',
      value: '+855 12 345 678',
    },
    pricing: {
      subtotal: 44.99,
      save: 0.0,
      deliveryFee: 0.0,
      total: 44.99,
    },
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(data.orderNumber);
    alert('Order number copied to clipboard!');
  };

  return (
    <div className="receipt-page">
      <div className="receipt-card">
        <header className="receipt-header">
          <div className="receipt-icon">
            <CheckCircle size={28} />
          </div>
          <div className="receipt-header-text">
            <h1>Order Confirmed</h1>
            <p>Thank you for shopping with UNIX.</p>
          </div>
          <div className="receipt-order-id">
            <span>Order ID:</span>
            <strong>{data.orderNumber}</strong>
            <button type="button" onClick={handleCopyOrder} className="copy-button">
              <Copy size={14} />
            </button>
          </div>
        </header>

        <section className="receipt-body">
          <div className="receipt-row receipt-summary-row">
            <div>
              <span>Delivery Carrier</span>
              <strong>{data.delivery.provider}</strong>
              <p>Est. Arrival: {data.delivery.timeframe}</p>
            </div>
            <div>
              <span>Contact Target</span>
              <strong>{data.contact.type}</strong>
              <p>{data.contact.value || 'Not provided'}</p>
            </div>
          </div>

          <div className="receipt-section">
            <div className="receipt-section-title">
              <ShoppingBag size={16} />
              <span>Your Items</span>
            </div>
            <div className="receipt-items">
              {data.items.map((item, index) => (
                <div className="receipt-item" key={index}>
                  <div className="item-left">
                    <div className="item-image">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.qty}</p>
                    </div>
                  </div>
                  <div className="item-price">US ${(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="receipt-row receipt-meta-row">
            <div>
              <span>Payment Method</span>
              <strong>{data.paymentMethod}</strong>
            </div>
            <div>
              <span>Date Authorized</span>
              <strong>{data.date}</strong>
            </div>
          </div>

          <div className="receipt-totals">
            <div className="receipt-totals-row">
              <span>Total</span>
              <strong>US ${data.pricing.subtotal.toFixed(2)}</strong>
            </div>
            <div className="receipt-totals-row">
              <span>Save</span>
              <strong>US ${data.pricing.save.toFixed(2)}</strong>
            </div>
            <div className="receipt-totals-row">
              <span>Delivery Fee</span>
              <strong>US ${data.pricing.deliveryFee.toFixed(2)}</strong>
            </div>
            <div className="receipt-totals-row receipt-totals-total">
              <span>Amount Paid</span>
              <strong>US ${data.pricing.total.toFixed(2)}</strong>
            </div>
          </div>
        </section>

        <footer className="receipt-actions">
          <button type="button" className="receipt-button" onClick={onBackToStore}>
            <ArrowLeft size={16} /> Continue Shopping
          </button>
          <button type="button" className="receipt-button receipt-button--secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print Receipt
          </button>
        </footer>
      </div>
    </div>
  );
}
