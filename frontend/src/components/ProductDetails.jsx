import React, { useState } from "react";
import { X, Star, ShoppingBag } from "lucide-react";

function ProductDetails({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState("");

  if (!product) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button style={styles.closeIcon} onClick={onClose}>
          <X size={24} />
        </button>

        <div style={styles.left}>
          <img
            src={product.image}
            alt={product.name}
            style={styles.image}
          />
        </div>

        <div style={styles.right}>
          <span style={styles.badge}>NEW ARRIVAL</span>

          <h1 style={styles.title}>{product.name}</h1>

          <div style={styles.rating}>
            <Star size={18} fill="#ffc107" color="#ffc107" />
            <Star size={18} fill="#ffc107" color="#ffc107" />
            <Star size={18} fill="#ffc107" color="#ffc107" />
            <Star size={18} fill="#ffc107" color="#ffc107" />
            <Star size={18} fill="#ffc107" color="#ffc107" />
            <span>(4.9)</span>
          </div>

          <h2 style={styles.price}>{product.price}</h2>

          <p style={styles.description}>
            Premium quality fashion item crafted with
            comfort and durability in mind. Perfect for
            casual wear, streetwear, and everyday style.
          </p>

          <h4>Select Size</h4>

          <div style={styles.sizes}>
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  ...styles.sizeBtn,
                  background:
                    selectedSize === size
                      ? "#000"
                      : "#fff",
                  color:
                    selectedSize === size
                      ? "#fff"
                      : "#000",
                  border:
                    selectedSize === size
                      ? "1px solid #000"
                      : "1px solid #ddd",
                }}
              >
                {size}
              </button>
            ))}
          </div>

          <div style={styles.buttons}>
            <button style={styles.cartBtn}>
              <ShoppingBag size={18} />
              Add To Cart
            </button>

            <button
              style={styles.closeBtn}
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    backdropFilter: "blur(5px)",
  },

  modal: {
    width: "1100px",
    maxWidth: "95%",
    minHeight: "650px",
    background: "#fff",
    borderRadius: "25px",
    overflow: "hidden",
    display: "flex",
    position: "relative",
    animation: "slideUp 0.3s ease",
    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
  },

  closeIcon: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "#f5f5f5",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  left: {
    flex: 1,
    background: "#f8f8f8",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  right: {
    flex: 1,
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  badge: {
    background: "#000",
    color: "#fff",
    padding: "8px 15px",
    borderRadius: "30px",
    fontSize: "12px",
    width: "fit-content",
    marginBottom: "15px",
  },

  title: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  rating: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginBottom: "20px",
  },

  price: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#111",
    marginBottom: "20px",
  },

  description: {
    color: "#666",
    lineHeight: "1.8",
    marginBottom: "30px",
  },

  sizes: {
    display: "flex",
    gap: "10px",
    marginBottom: "35px",
  },

  sizeBtn: {
    width: "50px",
    height: "50px",
    border: "1px solid #ddd",
    background: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  },

  buttons: {
    display: "flex",
    gap: "15px",
  },

  cartBtn: {
    flex: 1,
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },

  closeBtn: {
    background: "#f3f3f3",
    border: "none",
    padding: "16px 25px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default ProductDetails;