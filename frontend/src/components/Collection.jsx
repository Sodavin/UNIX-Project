import './css/Collection.css';
const products = [
  {
    id: 1,
    name: "White Sleeveless Top",
    price: "$15.59",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  },

  {
    id: 2,
    name: "Black Polo Shirt",
    price: "$34.95",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },

  {
    id: 3,
    name: "Printed Shirt",
    price: "$17.59",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598",
  },

  {
    id: 4,
    name: "Stripe Mini Dress",
    price: "$16.59",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
  },
  
];

export default function BestSellers() {
  return (
     
    <div className="arrival-container">
      {/* TITLE */}
      <div className="arrival-header">
        <h2>🔥 Best Sellers 🔥</h2>
        <p>Shop More</p>
      </div>

      {/* PRODUCTS */}
      <div className="products-grid">
        {products.map((item) => (
          <div className="card" key={item.id}>
            <div className="image-box">
              <img src={item.image} alt={item.name} />
            </div>

            <div className="product-info">
              <h3>{item.price}</h3>
              <p>{item.name}</p>
            </div>

            <button className="heart">♡</button>
          </div>
        ))}
      </div>
    </div>
  );
}