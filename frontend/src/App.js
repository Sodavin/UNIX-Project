import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "./components/cart/CartContext";
import CartDrawer from "./components/cart/CartDrawer";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";

import Men from "./components/Men";
import Women from "./components/Women";
import ProductDetail from "./components/ProductDetail";
import Checkout from "./components/Checkout";
import About from "./components/About";
import Contact from "./components/Contact";
import WishlistPage from "./components/WishlistPage";
import { WishlistProvider } from "./components/WishlistContext";

function App() {
  return (
    <BrowserRouter>
      <WishlistProvider>
        <CartProvider>
          <Navbar />
          <CartDrawer />

          <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/Men-Clothing" element={<Men />} />

        <Route path="/Women-Clothing" element={<Women />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/Checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          </Routes>

          <Footer />
        </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  );
}

export default App;