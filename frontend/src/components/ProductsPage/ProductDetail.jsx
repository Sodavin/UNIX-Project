import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { usePageTitle } from "../../utils/usePageTitle";
import "./css/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  usePageTitle(product ? `UNIX | ${product.name}` : "UNIX | Product");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectionError, setSelectionError] = useState({ color: false, size: false });
  const [addedToCart, setAddedToCart] = useState(false);
  const colorRef = useRef(null);
  const sizeRef = useRef(null);
  const addTimeoutRef = useRef(null);
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
      setSelectedSize(null);
      setSelectedColor(null);
      setSelectionError({ color: false, size: false });
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
        setSelectedSize(null);
        setSelectedColor(null);
        setSelectionError({ color: false, size: false });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Error");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    return () => {
      window.clearTimeout(addTimeoutRef.current);
    };
  }, []);

  const handleQuantity = (delta) => setQuantity((c) => Math.max(1, c + delta));

  const addToCart = () => {
    const availableSizes = product.sizes || ["S", "M", "L", "XL"];
    const needsColor = (product.colors && product.colors.length > 0) && !selectedColor;
    const needsSize = availableSizes.length > 0 && !selectedSize;

    if (needsColor || needsSize) {
      setSelectionError({ color: needsColor, size: needsSize });
      const targetRef = needsColor ? colorRef.current : sizeRef.current;
      if (targetRef?.scrollIntoView) {
        targetRef.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSelectionError({ color: false, size: false });
    addItem({
      id: product.id,
      name: product.name,
      price: product.discount_price != null && Number(product.discount_price) < Number(product.price)
        ? Number(product.discount_price)
        : Number(product.price),
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: selectedImage,
    });

    setAddedToCart(true);
    window.clearTimeout(addTimeoutRef.current);
    addTimeoutRef.current = window.setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
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
            {product.discount_price != null && Number(product.discount_price) < Number(product.price) ? (
              <>
                <span className="product-price product-price-new">${Number(product.discount_price).toFixed(2)}</span>
                <span className="product-price product-price-old">${Number(product.price).toFixed(2)}</span>
              </>
            ) : (
              <span className="product-price">${Number(product.price).toFixed(2)}</span>
            )}
            <span className="product-tag">{product.is_under_ten ? "Under $9.99" : ""}</span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-details-grid">
            <div>
              <span>Available</span>
              <strong>{product.available ? "In stock" : "Out of stock"}</strong>
            </div>
          </div>

          <div className={`color-selector ${selectionError.color ? "invalid" : ""}`} ref={colorRef}>
            <span>Color</span>
            <div className="color-options">
              {(product.colors || []).map((color) => (
                <button
                  key={color}
                  type="button"
                  className={selectedColor === color ? "color-swatch active" : "color-swatch"}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectionError((prev) => ({ ...prev, color: false }));
                  }}
                >
                  <span className="swatch-dot" style={{ background: (color || '').toLowerCase() }} />
                  <span className="color-name">{color}</span>
                </button>
              ))}
            </div>
            {selectionError.color && (
              <p className="selection-error">Please choose a color before adding to cart.</p>
            )}
          </div>

          <div className={`size-selector ${selectionError.size ? "invalid" : ""}`} ref={sizeRef}>
            <span>Size</span>
            <div className="size-options">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={selectedSize === size ? "size-button active" : "size-button"}
                  onClick={() => {
                    setSelectedSize(size);
                    setSelectionError((prev) => ({ ...prev, size: false }));
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            {selectionError.size && (
              <p className="selection-error">Please choose a size before adding to cart.</p>
            )}
          </div>

          <div className="product-action-row">
            <div className="quantity-picker">
              <button type="button" onClick={() => handleQuantity(-1)}>-</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => handleQuantity(1)}>+</button>
                    </div>

            <button className="product-add-btn" type="button" onClick={addToCart}>
              {addedToCart ? "Added" : "Add to Cart"}
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
