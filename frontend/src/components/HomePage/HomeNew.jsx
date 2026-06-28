import { useEffect, useState } from "react";
import Hero from "./Hero";
import ProductSection from "../ProductsPage/ProductSection";
import "../css/Home.css";

const formatImage = (src) => {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  return `${process.env.REACT_APP_API_URL || "http://localhost:8000"}${src.startsWith("/") ? "" : "/"}${src}`;
};

function Home() {
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

  const sections = [
    {
      id: "new-arrivals",
      title: "🔥 New Arrivals 🔥",
      subtitle: "10 fresh pieces just landed.",
      products: products.filter((product) => product.is_new_arrival).slice(0, 10),
      filterParam: "newarrival",
    },
    {
      id: "bestsellers",
      title: "🔥 Bestsellers 🔥",
      subtitle: "Our most-loved styles right now.",
      products: products.filter((product) => product.is_bestseller).slice(0, 10),
      filterParam: "bestsellers",
    },
    {
      id: "under-ten",
      title: "🔥 Under $10 🔥",
      subtitle: "Great value pieces for every day.",
      products: products.filter((product) => Number(product.price) <= 10).slice(0, 10),
      filterParam: "under10",
    },
  ];

  return (
    <main className="home-page">
      <Hero />
      {sections.map((section) => (
        <ProductSection
          key={section.id}
          sectionId={section.id}
          title={section.title}
          subtitle={section.subtitle}
          products={section.products}
          filterParam={section.filterParam}
        />
      ))}
    </main>
  );
}

export default Home;
