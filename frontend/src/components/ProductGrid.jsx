import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductsCard";
import "./css/ProductGrid.css";

const STAGGER_BASE = 0.06; // seconds between card reveals
const MAX_DELAY = 0.5; // prevent long waits on larger grid sizes
const FADE_DURATION = 220; // fade transition duration in ms

function ProductGrid({ products, currentPage, itemsPerPage, onPageChange, totalPages }) {
  const [isVisible, setIsVisible] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const transitionRef = useRef(null);
  const isInitialRender = useRef(true);

  const pageProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  }, [products, currentPage, itemsPerPage]);

  useEffect(() => {
    if (isInitialRender.current) {
      setDisplayedProducts(pageProducts);
      isInitialRender.current = false;
      return;
    }

    setIsVisible(false);

    if (transitionRef.current) {
      clearTimeout(transitionRef.current);
    }

    transitionRef.current = window.setTimeout(() => {
      setDisplayedProducts(pageProducts);
      setIsVisible(true);
    }, FADE_DURATION);

    return () => {
      if (transitionRef.current) {
        clearTimeout(transitionRef.current);
      }
    };
  }, [pageProducts]);

  const handlePage = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <>
      <div className={`product-grid-wrapper ${isVisible ? "visible" : "hidden"}`}>
        {displayedProducts.length > 0 ? (
          <div className="product-grid">
            {displayedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                animationDelay={`${Math.min(index * STAGGER_BASE, MAX_DELAY).toFixed(2)}s`}
              />
            ))}
          </div>
        ) : (
          <p className="no-results">No products match your search.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className={`page-btn prev ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => handlePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => handlePage(page)}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className={`page-btn next ${currentPage === totalPages ? "disabled" : ""}`}
            onClick={() => handlePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default ProductGrid;
