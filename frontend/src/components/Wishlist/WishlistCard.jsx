import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import "../css/WishlistCard.css";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function WishlistCard({ product, onRemove, onAddToCart }) {
  const displayPrice = product.discount_price ?? product.price;
  const hasDiscount = Number(product.discount_price) < Number(product.price);
  const stockLabel =
    product.stock === "out-of-stock"
      ? "Out of Stock"
      : product.stock === "low-stock"
      ? "Low Stock"
      : "In Stock";
  const stockClass =
    product.stock === "out-of-stock"
      ? "stock-chip red"
      : product.stock === "low-stock"
      ? "stock-chip orange"
      : "stock-chip green";

  return (
    <motion.article className="wishlist-card" variants={cardVariants} whileHover={{ y: -6 }}>
      <div className="card-image-wrap">
        <img src={product.image} alt={product.name} />
        <button className="remove-button" type="button" onClick={onRemove} aria-label="Remove from wishlist">
          <Heart size={18} />
        </button>
      </div>

      <div className="card-body">
        <div className="card-tag-row">
          {hasDiscount ? <span className="discount-badge">Sale</span> : null}
          <span className={stockClass}>{stockLabel}</span>
        </div>

        <div className="card-brand">{product.brand}</div>
        <h2 className="card-title">{product.name}</h2>

        <div className="card-price-row">
          <span className="current-price">${displayPrice}</span>
          {hasDiscount ? <span className="original-price">${product.price}</span> : null}
        </div>

        <div className="card-meta-row">
          <div>
            <span className="meta-label">Color</span>
            <strong>{product.colors?.[0] ?? "—"}</strong>
          </div>
          <div>
            <span className="meta-label">Size</span>
            <strong>{product.sizes?.[0] ?? "—"}</strong>
          </div>
        </div>

        <div className="card-action-row">
            <button
            className="primary-btn"
            type="button"
            onClick={onAddToCart}
            disabled={product.stock === "out-of-stock"}
          >
            <ShoppingBag size={16} /> Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default WishlistCard;
