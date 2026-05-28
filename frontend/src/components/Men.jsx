import ProductCard from "./ProductsCard";
import "./css/ProductGrid.css";
import FilterBar from "./FilterBar";

function Men() {

  const menProducts = [

    {
      id: 1,
      name: "Oversized Black Tee",
      price: 24.99,
      image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
    },

    {
      id: 2,
      name: "Street Hoodie",
      price: 39.99,
      image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb"
    },

    {
      id: 3,
      name: "Minimal Jacket",
      price: 54.99,
      image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
    },

    {
      id: 4,
      name: "Cargo Pants",
      price: 44.99,
      image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf"
    }
  ];

  return (
    <>
        <FilterBar />

        <section className="product-page">

        <h2>MEN COLLECTION</h2>

        <div className="product-grid">

            {menProducts.map((product) => (
            <ProductCard
                key={product.id}
                image={product.image}
                name={product.name}
                price={product.price}
            />
            ))}

        </div>

        </section>
    </>
  );
}

export default Men;