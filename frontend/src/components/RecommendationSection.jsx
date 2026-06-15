import ProductsCard from "./ProductsPage/ProductsCard";

function RecommendationSection({ recommendations }) {
  return (
    <section className="recommendation-section">
      <div className="recommendation-heading">
        <div>
          <span className="eyebrow">You May Also Like</span>
          <h2>Designer picks for your next edit</h2>
        </div>
      </div>

      <div className="recommendation-carousel">
        {recommendations.map((item) => (
          <ProductsCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}

export default RecommendationSection;
