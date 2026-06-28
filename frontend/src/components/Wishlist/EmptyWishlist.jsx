import { motion } from "framer-motion";
import { Heart } from "lucide-react";

function EmptyWishlist({ onContinue }) {
  return (
    <motion.section
      className="empty-wishlist"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="empty-icon">
        <Heart size={48} />
      </div>
      <h2>Your wishlist is empty</h2>
      <p>Save your favorite items and shop them later.</p>
      <button className="primary-btn" type="button" onClick={onContinue}>
        Continue Shopping
      </button>
    </motion.section>
  );
}

export default EmptyWishlist;
