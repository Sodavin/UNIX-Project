import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import { usePageTitle } from "../../utils/usePageTitle";
import "./css/ProductGrid.css";
import FilterBar from "./FilterBar";

function Women() {
  usePageTitle("UNIX | WOMEN");
  const womenSubcategories = [
    "Shirts",
    "T-Shirts",
    "Tops",
    "Dresses",
    "Skirts",
    "Jeans",
    "Sportwears"
  ];

  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // derive UI state from URL so browser navigation restores it
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

  const updateSearchParams = useCallback(
  (updates) => {
    // build from the current location search string to avoid stale hook closure
    const params = new URLSearchParams(window.location.search);

    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "") {
        params.delete(k);
      } else {
        params.set(k, typeof v === "number" ? String(v) : v);
      }
    });

    console.debug('[Women] updateSearchParams -> setting', params.toString());
    setSearchParams(params);
  },
  [setSearchParams]
);

// keep a local page state to avoid races between effects and URL updates
const [localPage, setLocalPage] = useState(currentPageState);

useEffect(() => {
  // when URL/page param changes (back/forward), sync local page
  setLocalPage(currentPageState);
}, [currentPageState]);

const setCurrentPage = (v) => {
  console.debug('[Women] setCurrentPage called with', v);
  setLocalPage(v);
  updateSearchParams({ page: v });
};

  const setSelectedSubcategory = (value) => updateSearchParams({ subcategory: value || null, page: 1 });
  const setFilterOption = (value) => updateSearchParams({ filter: value === "all" ? null : value, page: 1 });
  const setSortOption = (value) => updateSearchParams({ sort: value, page: 1 });
  

  const womenProducts = products
    .filter((p) => p.category === "women" && (selectedSubcategory ? p.subcategory === selectedSubcategory.toLowerCase().replace(/\s+/g, "-") : true))
    .filter((p) => {
      if (filterOption === "bestsellers") return p.is_bestseller;
      if (filterOption === "newarrival") return p.is_new_arrival;
      if (filterOption === "discount") return p.discount_price != null && Number(p.discount_price) < Number(p.price);
      if (filterOption === "under10") return Number(p.price) <= 10;
      return true;
    })
    .filter((p) => {
      if (!query) return true;
      const text = `${p.name || ""} ${p.subcategory || ""} ${p.description || ""}`.toLowerCase();
      return text.includes(query);
    });

  const sorted = (() => {
    const list = [...womenProducts];
    if (sortOption === "Price high to low") return list.sort((a, b) => b.price - a.price);
    if (sortOption === "Price low to high") return list.sort((a, b) => a.price - b.price);
    return list.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
  })();

  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));

  const prevFiltersRef = useRef({ subcategory: selectedSubcategory, query, sort: sortOption, productsLength: products.length });

  useEffect(() => {
    // When filters/categories/sort or product list change, reset to page 1.
    const prev = prevFiltersRef.current;
    const changed = prev.subcategory !== selectedSubcategory || prev.query !== query || prev.sort !== sortOption || prev.productsLength !== products.length;

    if (changed) {
      // update the prev snapshot
      prevFiltersRef.current = { subcategory: selectedSubcategory, query, sort: sortOption, productsLength: products.length };
      if (currentPageState !== 1) {
        const params = new URLSearchParams(window.location.search);
        params.set('page', '1');
        console.debug('[Women] resetting page -> 1 due to filter change');
        setSearchParams(params);
        setLocalPage(1);
      }
    }
  }, [selectedSubcategory, query, sortOption, products.length, currentPageState, setSearchParams]);

  useEffect(() => {
    if (currentPageState > totalPages) {
      const params = new URLSearchParams(window.location.search);
      params.set('page', String(totalPages));
      console.debug('[Women] currentPageState exceeds totalPages, setting page ->', totalPages);
      setSearchParams(params);
      setLocalPage(totalPages);
    }
  }, [
    totalPages,
    currentPageState,
    setSearchParams,
  ]);

  useEffect(() => {
    try {
      console.debug('[Women] currentPageState effect triggered ->', currentPageState, 'url:', window.location.href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error(e);
    }
  }, [currentPageState]);

  return (
    <>
      <FilterBar
        subcategories={womenSubcategories}
        activeSubcategory={selectedSubcategory}
        activeFilter={filterOption}
        sortOption={sortOption}
        onSelectSubcategory={setSelectedSubcategory}
        onSelectFilter={setFilterOption}
        onSortChange={setSortOption}
      />

      <section className="product-page">

        <h2>WOMEN COLLECTION</h2>

        <ProductGrid
          products={sorted}
          currentPage={localPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </section>
    </>
  );
}

export default Women;
