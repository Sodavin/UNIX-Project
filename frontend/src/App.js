import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Men from "./components/Men";
import Women from "./components/Women";
import Checkout from "./components/Checkout";
// import About from "./components/About";
// import Contact from "./components/Contact";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/Men-Clothing"
          element={<Men />}
        />

        <Route
          path="/Women-Clothing"
          element={<Women />}
        />

        {/* <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        /> */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;