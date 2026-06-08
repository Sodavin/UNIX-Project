function CartSummary({ subtotal, shipping, discount, total, isEmpty, onCheckout, onContinue, disabled = false }) {
  return (
    <div className="cart-summary-panel">
      <div className="cart-summary-list">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="summary-row discount-row">
          <span>Discount</span>
          <span>{discount > 0 ? `-$${discount.toFixed(2)}` : "-$0.00"}</span>
        </div>
        <div className="summary-row total-row">
          <strong>Estimated Total</strong>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </div>

      <div className="cart-summary-actions">
        <button
          className="checkout-button"
          type="button"
          onClick={onCheckout}
          disabled={isEmpty || disabled}
        >
          PROCEED TO CHECKOUT
        </button>
        <button className="secondary-button" type="button" onClick={onContinue}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default CartSummary;
