import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import PromoCode from "./PromoCode";
import "./CartDrawer.css";

function CartDrawer() {
  const navigate = useNavigate();
  const {
    isCartOpen,
    closeCart,
    items,
    count,
    subtotal,
    shipping,
    discount,
    total,
    removeItem,
    updateQuantity,
    updateItemOptions,
    clearCart,
    applyPromoCode,
    promoCode,
  } = useCart();

  const [promoMessage, setPromoMessage] = useState("");

  useEffect(() => {
    if (!isCartOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      closeCart();
    }
  };

  const handleApplyPromo = (code) => {
    const result = applyPromoCode(code);
    setPromoMessage(result.message);
  };

  // Disable checkout when any item lacks size or color selection
  const hasMissingOptions = items.some((it) => !it.size || !it.color);

  // Disable checkout when any item lacks size or color selection (always)
  const checkoutButtonDisabled = items.length === 0 || hasMissingOptions;

  // Prepare per-item missing-options map for child components
  const invalidMap = items.map((it) => ({ size: !it.size, color: !it.color }));

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          className="cart-drawer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleOverlayClick}
        >
          <motion.aside
            className="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <header className="cart-drawer-header">
              <div>
                <p className="cart-drawer-label">Shopping Cart</p>
                <h2>{`(${count}) items`}</h2>
              </div>
              <div className="cart-drawer-header-actions">
                <button
                  className="cart-clear-button"
                  type="button"
                  onClick={clearCart}
                  disabled={items.length === 0}
                >
                  Clear Cart
                </button>
                <button className="cart-close-button" type="button" onClick={closeCart} aria-label="Close cart drawer">
                  <X size={20} />
                </button>
              </div>
            </header>

            <div className="cart-drawer-body">
              {items.length === 0 ? (
                <div className="cart-empty-state">
                  <div className="empty-icon-wrapper">
                    <ShoppingBag size={40} />
                  </div>
                  <h3>Your cart is empty</h3>
                  <p>Luxury pieces are waiting. Add your first item to continue.</p>
                  <button className="secondary-button" type="button" onClick={closeCart}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items-list">
                    {items.map((item, idx) => (
                      <CartItem
                        key={`${item.id}-${item.size || "default"}-${item.color || "default"}-${idx}`}
                        item={item}
                        onDecrease={() => updateQuantity(item, -1)}
                        onIncrease={() => updateQuantity(item, 1)}
                        onRemove={() => removeItem(item)}
                        onOptionChange={(changes) => updateItemOptions(item, changes)}
                        invalidOptions={invalidMap[idx]}
                      />
                    ))}
                  </div>

                  <PromoCode onApply={handleApplyPromo} promoCode={promoCode} message={promoMessage} />
                </>
              )}
            </div>

            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              isEmpty={items.length === 0}
              disabled={checkoutButtonDisabled}
              onCheckout={() => {
                if (items.length === 0) return;
                const token = (() => {
                  const t = localStorage.getItem('authToken');
                  return t && t.trim() !== '' && t.trim().toLowerCase() !== 'null' && t.trim().toLowerCase() !== 'undefined' ? t.trim() : null;
                })();
                if (!token) {
                  closeCart();
                  navigate('/login?next=/Checkout');
                  return;
                }
                if (hasMissingOptions) return; // prevent navigation when options missing
                closeCart();
                navigate('/Checkout');
              }}
              onContinue={closeCart}
            />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
