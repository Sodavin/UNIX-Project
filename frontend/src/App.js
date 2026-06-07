import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Wishlist from "./components/Wishlist";

function App() {
  return (
    <div>
      <Navbar />

      <main style={{ padding: "50px", background: "#f5f5f5" }}>
        <Wishlist />
      </main>

      <Footer />
    </div>
  );
}

export default App;