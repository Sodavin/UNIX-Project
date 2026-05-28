import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Men from "./components/Men";
import Women from "./components/Women";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/Men-Clothing" element={<Men />} />

        <Route path="/Women-Clothing" element={<Women />} />

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;