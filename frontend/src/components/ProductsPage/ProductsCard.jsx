import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useCart } from "../cart/CartContext";
import { useWishlist } from "../Wishlist/WishlistContext";
import "./css/ProductsCard.css";

function ProductsCard({ product, animationDelay = "0s" }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const [added, setAdded] = useState(false);

  const displayPrice = product.discount_price ?? product.price;
  const hasDiscount =
    product.discount_price != null &&
    Number(product.discount_price) < Number(product.price);

  const handleOpenDetail = () => {
    navigate(`/product-detail/${product.id}`);
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: displayPrice,
      quantity: 1,
      image: image,
      size: product.size,
      color: product.color,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleAddToWishlist = (event) => {
    event.stopPropagation();
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
      return;
    }

    addToWishlist({
      id: product.id,
      name: product.name,
      brand: product.brand || product.collection || "UNIX",
      category: product.category || product.subcategory || "",
      image: image,
      price: product.price,
      discount_price: product.discount_price,
      stock: product.stock || (product.available ? "in-stock" : "out-of-stock"),
      sizes: product.sizes || [],
      colors: product.colors || (product.color ? [product.color] : []),
    });
  };

  const API = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const resolveImage = (productData) => {
    const rawImage =
      (productData.image_urls && productData.image_urls[0]) ||
      productData.image ||
      productData.image1 ||
      productData.image_url ||
      "";

    if (!rawImage) return "";
    if (/^https?:\/\//i.test(rawImage)) return rawImage;

    const normalized = rawImage.startsWith("/") ? rawImage : `/${rawImage}`;
    return `${API}${normalized}`;
  };

  const image = resolveImage(product);

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
        <button
          className={`wishlist-button ${isWishlisted(product.id) ? "active" : ""}`}
          type="button"
          onClick={handleAddToWishlist}
          aria-label={isWishlisted(product.id) ? "Saved to wishlist" : "Add to wishlist"}
        >
          <Heart size={16} />
        </button>
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
          <div className="product-price-group">
            <span className={hasDiscount ? "discounted-price" : "product-price"}>
              ${displayPrice}
            </span>
            {hasDiscount ? <span className="original-price">${product.price}</span> : null}
          </div>
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