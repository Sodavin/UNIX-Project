import React, { useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import ProductDetails from "./ProductDetails";

function Wishlist() {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Black Hoodie",
      price: "$45",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600",
    },
    {
      id: 2,
      name: "White Sneakers",
      price: "$60",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
    },
    {
      id: 3,
      name: "Classic Jacket",
      price: "$80",
      image:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=600",
    },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);

  const removeItem = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <Heart size={30} fill="black" />
          My Wishlist
        </h1>

        <span style={styles.count}>{wishlist.length} Items</span>
      </div>

      <div style={styles.grid}>
        {wishlist.map((item) => (
          <div key={item.id} style={styles.card}>
            <img
              src={item.image}
              alt={item.name}
              style={styles.image}
              onClick={() => setSelectedItem(item)}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            />

            <div style={styles.info}>
              <h3>{item.name}</h3>

              <p style={styles.price}>{item.price}</p>

              <div style={styles.buttons}>
                <button style={styles.cartBtn}>
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {wishlist.length === 0 && (
        <div style={styles.empty}>
          <Heart size={60} color="#999" />
          <h2>Your Wishlist is Empty</h2>
        </div>
      )}

      <ProductDetails
        product={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "36px",
    fontWeight: "bold",
  },

  count: {
    background: "black",
    color: "white",
    padding: "10px 20px",
    borderRadius: "30px",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "white",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "0.3s ease",
  },

  image: {
    width: "100%",
    height: "280px",
    objectFit: "cover",
    cursor: "pointer",
    transition: "0.3s ease",
  },

  info: {
    padding: "20px",
  },

  price: {
    fontSize: "20px",
    fontWeight: "bold",
  },

  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },

  cartBtn: {
    flex: 1,
    background: "black",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: "bold",
  },

  deleteBtn: {
    background: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    marginTop: "80px",
    color: "#777",
  },
};

export default Wishlist;