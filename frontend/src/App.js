import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { capitalizeWords } from "./utils/stringUtils";

import { CartProvider } from "./components/cart/CartContext";
import CartDrawer from "./components/cart/CartDrawer";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Men from "./components/Men";
import Women from "./components/Women";
import ProductDetail from "./components/ProductDetail";
import Checkout from "./components/Checkout";
import About from "./components/About";
import Contact from "./components/Contact";
import WishlistPage from "./components/WishlistPage";
import { WishlistProvider } from "./components/WishlistContext";

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function getAuthToken() {
  const token = localStorage.getItem('authToken');
  return token && token.trim() !== '' && token.trim().toLowerCase() !== 'null' && token.trim().toLowerCase() !== 'undefined'
    ? token.trim()
    : null;
}

function RequireAuth({ children }) {
  const token = getAuthToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getAuthToken()));
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const updateAuthState = () => {
      setIsLoggedIn(Boolean(getAuthToken()));
    };

    window.addEventListener('storage', updateAuthState);
    return () => window.removeEventListener('storage', updateAuthState);
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${API}/api/user/profile/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) return;
        const data = await response.json();

        if (data.first_name) setUserName(capitalizeWords(data.first_name));
        else if (data.username) setUserName(data.username);
        if (data.email) setUserEmail(data.email);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to restore logged-in user state', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const token = getAuthToken();
  const isAuthenticated = isLoggedIn || Boolean(token);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <WishlistProvider>
        <CartProvider>
          <Navbar isLoggedIn={isAuthenticated} userName={userName} />
          <CartDrawer />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} setUserEmail={setUserEmail} />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} setUserEmail={setUserEmail} />} />
            <Route path="/dashboard" element={
              isAuthenticated ? (
                <Dashboard
                  setIsLoggedIn={setIsLoggedIn}
                  userName={userName}
                  setUserName={setUserName}
                  userEmail={userEmail}
                  setUserEmail={setUserEmail}
                />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} setUserEmail={setUserEmail} />
              )
            } />
            <Route path="/Men-Clothing" element={<Men />} />
            <Route path="/Women-Clothing" element={<Women />} />
            <Route path="/About" element={<About />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/product-detail/:id" element={<ProductDetail />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            <Route
              path="/Checkout"
              element={
                <RequireAuth>
                  <Checkout />
                </RequireAuth>
              }
            />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>

          <Footer />
        </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  );
}

export default App;