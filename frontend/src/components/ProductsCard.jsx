import "./css/ProductsCard.css";

function ProductsCard({
  image,
  name,
  price,
  onAddToCart,
}) {
  return (
    <div className="product-card">
      <img src={image} alt={name} />

      <div className="product-info">
        <h3>{name}</h3>

        <p>${price}</p>

        <button onClick={onAddToCart}>
          Add To Cart
        </button>
      </div>
    </div>
  );
}

export default ProductsCard;