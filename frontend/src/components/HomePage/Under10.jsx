import { useEffect, useState } from "react";
import ProductSection from "../ProductsPage/ProductSection";

const formatImage = (src) => {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  return `${process.env.REACT_APP_API_URL || "http://localhost:8000"}${src.startsWith("/") ? "" : "/"}${src}`;
};

function Under10() {
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

  const under10Products = products
    .filter((product) => Number(product.price) <= 10)
    .slice(0, 10);

  return (
    <ProductSection
      sectionId="under-ten"
      title="🔥 Under $10 🔥"
      subtitle="Great value pieces for every day."
      products={under10Products}
      filterParam="under10"
    />
  );
}

export default Under10;
