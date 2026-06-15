import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "../../utils/usePageTitle";
import { useCart } from "../cart/CartContext";
import { useWishlist } from "./WishlistContext";
import WishlistActions from "./WishlistActions";
import ProductsCard from "./ProductsCard";
import EmptyWishlist from "./EmptyWishlist";
import RecommendationSection from "../RecommendationSection";
import "./css/WishlistPage.css";

const defaultRecommendations = [
  {
    id: 201,
    name: "Aster Cable Knit Sweater",
    brand: "Nova Noir",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=640",
    price: 145,
    discount_price: 122,
    stock: "in-stock",
    colors: ["Cream", "Black"],
  },
  {
    id: 202,
    name: "Sienna Wide-Leg Trousers",
    brand: "UNIX Atelier",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=640",
    price: 180,
    discount_price: 180,
    stock: "in-stock",
    colors: ["Navy", "Taupe"],
  },
  {
    id: 203,
    name: "Arden Leather Loafers",
    brand: "Stroma",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=640",
    price: 198,
    discount_price: 178,
    stock: "in-stock",
    colors: ["Black", "Brown"],
  },
  {
    id: 204,
    name: "Noir Satin Camisole",
    brand: "Elise & Co.",
    image: "https://images.unsplash.com/photo-1503342452485-86f3d7b0072b?q=80&w=640",
    price: 95,
    discount_price: 78,
    stock: "in-stock",
    colors: ["Onyx", "Pearl"],
  },
];

function WishlistPage() {
  usePageTitle("UNIX | Wishlist");
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { items: wishlistItems, clearWishlist } = useWishlist();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);

  const totalItems = wishlistItems.length;

  const wishlistCountLabel = useMemo(
    () => `${totalItems} ${totalItems === 1 ? "Item" : "Items"}`,
    [totalItems]
  );

  const moveAllToCart = () => {
    wishlistItems.forEach((item) => addItem({ ...item, quantity: 1 }));
    clearWishlist();
  };

  // const removeProduct = (productId) => {
  //   removeFromWishlist(productId);
  // };

  const continueShopping = () => navigate("/");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    let active = true;
    const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

    setIsLoadingRecommendations(true);
    fetch(`${API}/api/products/`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch products");
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        const products = Array.isArray(data) ? data : data.results || [];
        const bestsellerItems = products
          .filter((product) => product.is_bestseller)
          .slice(0, 4)
          .map((product) => ({
            id: product.id,
            name: product.name,
            brand: product.brand || product.collection || "UNIX",
            category: product.category || product.subcategory || "",
            image: product.image || product.image1 || product.image_url || "",
            price: product.price,
            discount_price: product.discount_price,
            stock: product.stock || (product.available ? "in-stock" : "out-of-stock"),
            colors: product.colors || [product.color] || [],
          }));

        setRecommendations(bestsellerItems);
      })
      .catch((error) => {
        console.error("Failed to load bestseller recommendations", error);
        if (active) {
          setRecommendations(defaultRecommendations.slice(0, 4));
        }
      })
      .finally(() => {
        if (active) setIsLoadingRecommendations(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <motion.main
      className="wishlist-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="wishlist-content">
        <div className="wishlist-header-panel">
          <div className="wishlist-title-panel">
            <span className="wishlist-label">My Wishlist</span>
            <h1>{`My Wishlist (${wishlistCountLabel})`}</h1>
          </div>

          <WishlistActions
            itemCount={totalItems}
            onMoveAllToCart={moveAllToCart}
            onClearWishlist={clearWishlist}
          />
        </div>

        <AnimatePresence mode="wait">
          {totalItems === 0 ? (
            <EmptyWishlist onContinue={continueShopping} />
          ) : (
            <motion.section
              className="wishlist-grid"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {wishlistItems.map((item) => (
                <ProductsCard
                  key={item.id}
                  product={item}
                  animationDelay="0s"
                />
              ))}
            </motion.section>
          )}
        </AnimatePresence>

        <RecommendationSection
          recommendations={isLoadingRecommendations ? defaultRecommendations.slice(0, 4) : recommendations}
        />

      </div>
    </motion.main>
  );
}

export default WishlistPage;
