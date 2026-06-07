import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";

import Men from "./components/Men";
import Women from "./components/Women";
import ProductDetail from "./components/ProductDetail";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/Men-Clothing" element={<Men />} />

        <Route path="/Women-Clothing" element={<Women />} />

        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/product-detail" element={<ProductDetail />} />

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;