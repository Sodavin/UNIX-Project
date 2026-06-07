import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./css/ProductsCard.css";

function ProductsCard({ product, animationDelay = "0s" }) {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleOpenDetail = () => {
    navigate(`/product-detail/${product.id}`);
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.id === product.id && !i.variant);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const API = process.env.REACT_APP_API_URL || "http://localhost:8000";
  let image = (product.image_urls && product.image_urls[0]) || product.image1;
  if (image && !/^https?:\/\//i.test(image)) {
    if (!image.startsWith('/')) image = `/${image}`;
    image = `${API}${image}`;
  }

  return (
    <div
      className="product-card"
      onClick={handleOpenDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") handleOpenDetail();
      }}
    >
      <div className="product-image">
        {image ? (
          <img src={image} alt={product.name} />
        ) : (
          <div className="image-placeholder" aria-hidden="true" />
        )}
        {product.is_bestseller && (
          <div className="bestseller-tag">Bestseller</div>
        )}
      </div>

      <div className="product-info">
        <div className="product-title-row">
          <h3>{product.name}</h3>
          <span className="product-price">${product.price}</span>
        </div>

        <button
          className="add-to-cart"
          type="button"
          onClick={handleAddToCart}
          aria-pressed={added}
        >
          {added ? "Added" : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductsCard;