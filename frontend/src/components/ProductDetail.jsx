import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "./cart/CartContext";
import "./css/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    const API = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const normalize = (src) => {
      if (!src) return null;
      if (/^https?:\/\//i.test(src)) return src;
      return `${API}${src.startsWith('/') ? '' : '/'}${src}`;
    };

    const cache = window.__PRODUCT_CACHE__ || (window.__PRODUCT_CACHE__ = {});
    if (cache[id]) {
      setProduct(cache[id]);
      setSelectedImage(normalize((cache[id].image_urls && cache[id].image_urls[0]) || cache[id].image1));
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API}/api/products/${id}/`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load product");
        return r.json();
      })
      .then((data) => {
        window.__PRODUCT_CACHE__[id] = data;
        setProduct(data);
        setSelectedImage(normalize((data.image_urls && data.image_urls[0]) || data.image1));
        // initialize selectors
        setSelectedSize((data.sizes && data.sizes[0]) || null);
        setSelectedColor((data.colors && data.colors[0]) || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Error");
        setLoading(false);
      });
  }, [id]);

  const handleQuantity = (delta) => setQuantity((c) => Math.max(1, c + delta));

  const addToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: selectedImage,
    });
    alert("Added to cart");
  };

  if (loading) return <div className="loading">Loading product…</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  const API = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const normalize = (src) => {
    if (!src) return null;
    if (/^https?:\/\//i.test(src)) return src;
    return `${API}${src.startsWith('/') ? '' : '/'}${src}`;
  };

  const thumbnails = (product.image_urls && product.image_urls.length ? product.image_urls : [product.image1]).map(normalize).filter(Boolean);
  const sizes = product.sizes || ["S", "M", "L", "XL"];

  return (
    <main className="product-detail-page">
      <section className="product-hero">
        <div className="product-gallery">
          <div className="product-main-image">
            <img src={selectedImage} alt={product.name} />
          </div>

          <div className="product-thumbs">
            {thumbnails.map((src, index) => (
              <div
                className={`thumb-item ${selectedImage === src ? "active" : ""}`}
                key={index}
                onClick={() => setSelectedImage(src)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter") setSelectedImage(src);
                }}
              >
                <img src={src} alt={`Alternate view ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <aside className="product-summary">
          {product.is_new_arrival && <span className="product-label">New Arrival</span>}
          {product.is_featured && <span className="product-label">Featured</span>}
          <h1>{product.name}</h1>
          <p className="product-category">{product.subcategory}</p>

          <div className="price-row">
            <span className="product-price">${product.price}</span>
            <span className="product-tag">{product.is_under_ten ? "Under $9.99" : ""}</span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-details-grid">
            <div>
              <span>Available</span>
              <strong>{product.available ? "In stock" : "Out of stock"}</strong>
            </div>
          </div>

          <div className="color-selector">
            <span>Color</span>
            <div className="color-options">
              {(product.colors || []).map((color) => (
                <button
                  key={color}
                  type="button"
                  className={selectedColor === color ? "color-swatch active" : "color-swatch"}
                  onClick={() => setSelectedColor(color)}
                >
                  <span className="swatch-dot" style={{ background: (color || '').toLowerCase() }} />
                  <span className="color-name">{color}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="size-selector">
            <span>Size</span>
            <div className="size-options">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={selectedSize === size ? "size-button active" : "size-button"}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-action-row">
            <div className="quantity-picker">
              <button type="button" onClick={() => handleQuantity(-1)}>-</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => handleQuantity(1)}>+</button>
            </div>

            <button className="primary-btn" type="button" onClick={addToCart}>
              Add to Cart
            </button>
          </div>

          <div className="product-support">
            <div>
              <strong>30-day returns</strong>
              <p>Easy exchange or refund.</p>
            </div>
            <div>
              <strong>Premium support</strong>
              <p>Live help whenever you need it.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="product-info-panel">
        <div className="info-card">
          <h2>Product details</h2>
          <p>{product.long_description || product.description}</p>
          <ul>
            {(product.features || []).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="info-card">
          <h2>Shipping & returns</h2>
          <p>
            Orders ship within 24 hours. Free delivery for orders over $50. Hassle-free 30-day returns with full refund.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;
