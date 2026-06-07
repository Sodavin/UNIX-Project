import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import "./css/ProductGrid.css";
import FilterBar from "./FilterBar";

function Men() {
  const menSubcategories = [
    "Shirts",
    "T-Shirts",
    "Pants",
    "Hoodies",
    "Suits",
    "Sportwears"
  ];

  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // derive UI state directly from URL so back/forward always reflects it
  const selectedSubcategory = searchParams.get("subcategory") || null;
  const filterOption = searchParams.get("filter") || "all";
  const sortOption = searchParams.get("sort") || "Recommend";
  const currentPageState = Number(searchParams.get("page") || 1);

  useEffect(() => {
    const API = process.env.REACT_APP_API_URL || "http://localhost:8000";
    let mounted = true;
    fetch(`${API}/api/products/`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const normalize = (src) => {
          if (!src) return null;
          if (/^https?:\/\//i.test(src)) return src;
          return `${API}${src.startsWith('/') ? '' : '/'}${src}`;
        };

        const normalized = data.map((p) => ({
          ...p,
          image_urls: (p.image_urls || []).map(normalize).filter(Boolean),
          image1: normalize(p.image1),
        }));

        setProducts(normalized);
      })
      .catch((err) => console.error(err));
    return () => (mounted = false);
  }, []);

  const query = searchParams.get("q")?.trim().toLowerCase() || "";

  const updateSearchParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "") params.delete(k);
      else params.set(k, typeof v === "number" ? String(v) : v);
    });
    setSearchParams(params);
  };

  const setSelectedSubcategory = (value) => {
    updateSearchParams({ subcategory: value || null, page: 1 });
  };

  const setFilterOption = (value) => {
    updateSearchParams({ filter: value === "all" ? null : value, page: 1 });
  };

  const setSortOption = (value) => {
    updateSearchParams({ sort: value, page: 1 });
  };

  const setCurrentPage = (v) => updateSearchParams({ page: v });

  const menProducts = products
    .filter((p) => p.category === "men" && (selectedSubcategory ? p.subcategory === selectedSubcategory.toLowerCase().replace(/\s+/g, "-") : true))
    .filter((p) => {
      if (filterOption === "bestsellers") return p.is_bestseller;
      if (filterOption === "newarrival") return p.is_new_arrival;
      if (filterOption === "under10") return Number(p.price) <= 10;
      return true;
    })
    .filter((p) => {
      if (!query) return true;
      const text = `${p.name || ""} ${p.subcategory || ""} ${p.description || ""}`.toLowerCase();
      return text.includes(query);
    });

  const sorted = (() => {
    const list = [...menProducts];
    if (sortOption === "Price high to low") return list.sort((a, b) => b.price - a.price);
    if (sortOption === "Price low to high") return list.sort((a, b) => a.price - b.price);
    // Recommend: show bestsellers first, keep relative order otherwise (stable sort)
    return list.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
  })();

  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));

  useEffect(() => {
    // Reset to first page when filters/search/sort change
    setCurrentPage(1);
  }, [selectedSubcategory, query, sortOption, products.length]);

  useEffect(() => {
    // Clamp currentPage if number of pages shrinks
    if (currentPageState > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPageState]);

  useEffect(() => {
    // Scroll to top when page changes
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      // fallback for environments without window
      // no-op
    }
  }, [currentPageState]);

  return (
    <>
      <FilterBar
        subcategories={menSubcategories}
        activeSubcategory={selectedSubcategory}
        activeFilter={filterOption}
        sortOption={sortOption}
        onSelectSubcategory={setSelectedSubcategory}
        onSelectFilter={setFilterOption}
        onSortChange={setSortOption}
      />

      <section className="product-page">

        <h2>MEN COLLECTION</h2>

        <ProductGrid
          products={sorted}
          currentPage={currentPageState}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </section>
    </>
  );
}

export default Men;
