import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import './css/Receipt.css';

export default function Receipt({ orderData, onBackToStore }) {
  const normalizedOrder = orderData || {};
  const data = {
    orderNumber: normalizedOrder.orderNumber || (normalizedOrder.id ? `UNX-${String(normalizedOrder.id).padStart(6, '0')}` : `UNX-${Math.floor(100000 + Math.random() * 900000)}`),
    date: normalizedOrder.created_at
      ? new Date(normalizedOrder.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : normalizedOrder.date || new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
    delivery: {
      provider: 'Virak Buntham',
      timeframe: '2-3 days',
    },
    items: Array.isArray(normalizedOrder.items) && normalizedOrder.items.length > 0
      ? normalizedOrder.items.map((item) => ({
          name: item.product?.name || item.name || 'Product',
          qty: item.quantity || item.qty || 1,
          price: item.price ?? item.unitPrice ?? 0,
          size: item.size || '',
          color: item.color || '',
        }))
      : [
          {
            name: 'Elegant Dress',
            qty: 1,
            price: 44.99,
            image: 'https://via.placeholder.com/60',
            size: '',
            color: '',
          },
        ],
    paymentMethod: normalizedOrder.payment_method || normalizedOrder.paymentMethod || 'ABA PAY (Scan to Pay)',
    contact: {
      type: 'Phone',
      value: normalizedOrder.phone || normalizedOrder.contact?.value || '+855 12 345 678',
    },
    address: {
      recipientName: normalizedOrder.full_name || normalizedOrder.address?.recipientName || 'Customer Name',
      phoneNumber: normalizedOrder.phone || normalizedOrder.contact?.value || '+855 12 345 678',
      provinceCity: normalizedOrder.city || normalizedOrder.address?.provinceCity || '',
      district: normalizedOrder.state || normalizedOrder.address?.district || '',
      addressDetails: normalizedOrder.address || normalizedOrder.address?.addressDetails || '',
    },
    pricing: {
      subtotal: Number(normalizedOrder.total_price ?? normalizedOrder.pricing?.subtotal ?? normalizedOrder.total ?? 44.99),
      save: 0.0,
      deliveryFee: 0.0,
      total: Number(normalizedOrder.total_price ?? normalizedOrder.pricing?.total ?? normalizedOrder.total ?? 44.99),
    },
  };

  // const handleCopyOrder = () => {
  //   navigator.clipboard.writeText(data.orderNumber);
  //   alert('Order number copied to clipboard!');
  // };

  const addressText = data.address
    ? `${data.address.recipientName}, ${data.address.phoneNumber}, ${data.address.provinceCity}${data.address.district ? `, ${data.address.district}` : ''}, ${data.address.addressDetails}`
    : 'Delivery address not provided';

  return (
    <div className="receipt-page">
      <div className="receipt-card receipt-card--invoice">
        <header className="receipt-header receipt-header--invoice">
          <div className="company-block">
            <strong>UNIX Clothing Store</strong>
            <div>1234 Company St,</div>
            <div>Company Town, ST 12345</div>
          </div>

          <div className="receipt-right-block">
            <div className="logo-upload-placeholder">
              <img src="/logo.png" alt="UNIX Logo" />
            </div>
            <h2 className="receipt-main-title">RECEIPT</h2>
          </div>
        </header>

        <section className="receipt-body receipt-body--invoice">
          <div className="invoice-top">
            <div className="billed-to">
              <h4>Billed To</h4>
              <div className="customer-name">{data.contact.value || 'Customer Name'}</div>
              <div className="customer-contact">{data.contact.type || ''}</div>
            </div>

            <div className="invoice-meta">
              <div className="meta-row">
                <span>Receipt #</span>
                <strong>{data.orderNumber}</strong>
              </div>
              <div className="meta-row">
                <span>Receipt date</span>
                <strong>{data.date}</strong>
              </div>
            </div>
          </div>

          <div className="invoice-details">
            <div className="detail-row">
              <span>Payment Method</span>
              <strong>{data.paymentMethod}</strong>
            </div>
            <div className="detail-row">
              <span>Delivery Address</span>
              <strong>{addressText}</strong>
            </div>
          </div>

          <div className="invoice-table">
            <div className="table-header">
              <div className="col qty">QTY</div>
              <div className="col desc">Description</div>
              <div className="col unit">Unit Price</div>
              <div className="col amount">Amount</div>
            </div>

            <div className="table-body">
              {data.items.map((item, idx) => (
                <div className="table-row" key={idx}>
                  <div className="col qty">{item.qty}</div>
                  <div className="col desc">
                    <div className="desc-name">{item.name}</div>
                    <div className="desc-meta">{item.size ? `Size: ${item.size}` : ''} {item.color ? ` • Color: ${item.color}` : ''}</div>
                  </div>
                  <div className="col unit">${Number(item.price).toFixed(2)}</div>
                  <div className="col amount">${(Number(item.price) * Number(item.qty)).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="table-footer">
              <div className="totals">
                <div className="totals-row"><span>Subtotal</span><strong>US ${data.pricing.subtotal.toFixed(2)}</strong></div>
                <div className="totals-row"><span>Sales Tax</span><strong>US $0.00</strong></div>
                <div className="totals-row totals-row--total"><span>Total (USD)</span><strong>US ${data.pricing.total.toFixed(2)}</strong></div>
              </div>
            </div>
          </div>

          <div className="invoice-notes">
            <h5>Notes</h5>
            <p>Thank you for your purchase! All sales are final after 30 days. Please retain this receipt for warranty or exchange purposes.</p>
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
