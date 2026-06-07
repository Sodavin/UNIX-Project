import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductsCard from "./ProductsCard";
import "./css/ProductSection.css";

function ProductSection({ title, subtitle, products, filterParam, sectionId }) {
  const scrollRow = (direction) => {
    const strip = document.querySelector(`[data-strip="${sectionId}"]`);
    if (!strip) return;
    const amount = Math.round(strip.clientWidth);
    strip.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      className="section-block"
      initial="visible"
      whileInView="visible"
      viewport={{ once: true, amount: "some" }}
      variants={containerVariants}
    >
      <div className="section-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="section-actions">
          <Link
            to={`/Men-Clothing?filter=${filterParam}`}
            className="shop-now-button"
          >
            Shop Now
          </Link>
        </div>
      </div>

      <div className="strip-row">
        <button
          type="button"
          className="strip-control prev"
          onClick={() => scrollRow("prev")}
          aria-label="Scroll backward"
        >
          ‹
        </button>

        <div className="product-strip" data-strip={sectionId}>
          {products.length ? (
            <motion.div className="product-strip-wrapper" variants={containerVariants}>
              {products.map((product, index) => (
                <motion.div
                  key={`${sectionId}-${product.id}`}
                  className="product-strip-item"
                  variants={itemVariants}
                >
                  <ProductsCard
                    product={product}
                    animationDelay={`${Math.min(index * 0.04, 0.4).toFixed(2)}s`}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="empty-message">No products available for this section yet.</p>
          )}
        </div>

        <button
          type="button"
          className="strip-control next"
          onClick={() => scrollRow("next")}
          aria-label="Scroll forward"
        >
          ›
        </button>
      </div>
    </motion.section>
  );
}

export default ProductSection;
