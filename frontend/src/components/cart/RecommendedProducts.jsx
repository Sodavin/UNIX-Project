import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "./CartContext";

const normalizeImage = (src) => {
  if (!src) return "https://via.placeholder.com/400";
  if (/^https?:\/\//i.test(src)) return src;
  return `${process.env.REACT_APP_API_URL || "http://localhost:8000"}${src.startsWith("/") ? "" : "/"}${src}`;
};

function RecommendedProducts() {
  const { items } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

    fetch(`${API}/api/products/`)
      .then((response) => response.json())
      .then((data) => {
        if (!mounted) return;
        setProducts(
          data.map((product) => ({
            ...product,
            image: normalizeImage((product.image_urls && product.image_urls[0]) || product.image1),
          }))
        );
      })
      .catch(() => {
        if (!mounted) return;
        setProducts([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const cartItemIds = useMemo(() => items.map((item) => String(item.id)), [items]);
  const cartCategories = useMemo(
    () => new Set(items.map((item) => item.subcategory || item.category).filter(Boolean)),
    [items]
  );

  const recommended = useMemo(() => {
    const candidates = products.filter((product) => !cartItemIds.includes(String(product.id)));
    if (candidates.length === 0) return [];

    const related = candidates.filter((product) => cartCategories.has(product.subcategory || product.category));
    const fallback = candidates.filter((product) => !related.includes(product));
    return [...related, ...fallback].slice(0, 4);
  }, [products, cartItemIds, cartCategories]);

  return (
    <section className="recommended-section">
      <div className="recommended-header">
        <h3>You May Also Like</h3>
        <p>Complete the look with select styles.</p>
      </div>
      <motion.div
        className="recommended-list"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {recommended.map((product) => (
          <div className="recommended-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <div>
              <p>{product.name}</p>
              <span>${Number(product.price || 0).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

export default RecommendedProducts;
