import ProductCard from "./ProductsCard";
import "./css/ProductGrid.css";
import FilterBar from "./FilterBar";

function Women() {

  const womenProducts = [

    {
      id: 1,
      name: "Elegant Dress",
      price: 44.99,
      image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b"
    },

    {
      id: 2,
      name: "Minimal Coat",
      price: 59.99,
      image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c"
    },

    {
      id: 3,
      name: "Fashion Blazer",
      price: 69.99,
      image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b"
    },

    {
      id: 4,
      name: "Classic White Top",
      price: 29.99,
      image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1"
    }
  ];

  return (
    <>
        <FilterBar />
        <section className="product-page">

        <h2>WOMEN COLLECTION</h2>

        <div className="product-grid">

            {womenProducts.map((product) => (
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

export default Women;