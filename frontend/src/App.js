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

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <CartDrawer />

        <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/Men-Clothing" element={<Men />} />

        <Route path="/Women-Clothing" element={<Women />} />

        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/Checkout" element={<Checkout />} />

      </Routes>

      <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;