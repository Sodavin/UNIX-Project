import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2 } from "lucide-react";

function WishlistActions({ itemCount, onMoveAllToCart, onClearWishlist }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="wishlist-actions">
      <div className="action-buttons">
        <button className="secondary-btn" type="button" onClick={onMoveAllToCart} disabled={itemCount === 0}>
          <ShoppingBag size={16} /> Move All To Cart
        </button>
        <button className="outline-btn" type="button" onClick={() => setShowConfirm(true)} disabled={itemCount === 0}>
          <Trash2 size={16} /> Clear Wishlist
        </button>
      </div>

      <AnimatePresence>
        {showConfirm ? (
          <motion.div
            className="confirm-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p>Clear all saved items from your wishlist?</p>
            <div className="confirm-actions">
              <button className="outline-btn" type="button" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button
                className="primary-btn"
                type="button"
                onClick={() => {
                  onClearWishlist();
                  setShowConfirm(false);
                }}
              >
                Confirm Clear
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default WishlistActions;
