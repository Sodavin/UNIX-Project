import { useEffect, useState } from "react";
import ProductSection from "../ProductsPage/ProductSection";

const formatImage = (src) => {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  return `${process.env.REACT_APP_API_URL || "http://localhost:8000"}${src.startsWith("/") ? "" : "/"}${src}`;
};

function Bestsellers() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    const API = process.env.REACT_APP_API_URL || "http://localhost:8000";
    fetch(`${API}/api/products/`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const normalized = data.map((product) => ({
          ...product,
          image_urls: (product.image_urls || []).map(formatImage).filter(Boolean),
          image1: formatImage(product.image1),
        }));
        setProducts(normalized);
      })
      .catch((error) => console.error("Unable to load products", error));

    return () => {
      mounted = false;
    };
  }, []);

  const bestsellerProducts = products
    .filter((product) => product.is_bestseller)
    .slice(0, 10);

  return (
    <ProductSection
      sectionId="bestsellers"
      title="🔥 Bestsellers 🔥"
      subtitle="Our most-loved styles right now."
      products={bestsellerProducts}
      filterParam="bestsellers"
    />
  );
}

export default Bestsellers;
