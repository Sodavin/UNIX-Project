import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { capitalizeWords } from "./utils/stringUtils";

import { CartProvider } from "./components/cart/CartContext";
import CartDrawer from "./components/cart/CartDrawer";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/HomePage/Home";
import BackToTop from "./components/BackToTop";
import Signup from "./components/Account/Signup";
import Login from "./components/Account/Login";
import Dashboard from "./components/Account/Dashboard";
import Men from "./components/ProductsPage/Men";
import Women from "./components/ProductsPage/Women";
import ProductDetail from "./components/ProductsPage/ProductDetail";
import Checkout from "./components/Checkout";
import About from "./components/About";
import Contact from "./components/Contact";
import WishlistPage from "./components/Wishlist/WishlistPage";
import { WishlistProvider } from "./components/Wishlist/WishlistContext";
import ChatWidget from "./components/chat/ChatWidget";
import AdminDashboardLayout from "./components/AdminDashboard/AdminDashboardLayout";
import AdminOverview from "./components/AdminDashboard/AdminOverview";
import AdminProducts from "./components/AdminDashboard/AdminProducts";
import AdminOrders from "./components/AdminDashboard/AdminOrders";
import AdminCustomers from "./components/AdminDashboard/AdminCustomers";
import AdminAnalytics from "./components/AdminDashboard/AdminAnalytics";
import AdminSettings from "./components/AdminDashboard/AdminSettings";

const API = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

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

function RequireAdmin({ children, isAdmin, authChecked }) {
  const token = getAuthToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!authChecked) {
    return <div className="loading-screen">Loading admin permissions...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getAuthToken()));
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const updateAuthState = () => {
      const token = getAuthToken();
      setIsLoggedIn(Boolean(token));
      if (!token) {
        setIsAdmin(false);
      }
    };

    window.addEventListener('storage', updateAuthState);
    window.addEventListener('authChanged', updateAuthState);
    return () => {
      window.removeEventListener('storage', updateAuthState);
      window.removeEventListener('authChanged', updateAuthState);
    };
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setAuthChecked(true);
      setIsLoggedIn(false);
      setIsAdmin(false);
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${API}/api/user/profile/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          setIsLoggedIn(false);
          setIsAdmin(false);
          setAuthChecked(true);
          return;
        }
        const data = await response.json();

        if (data.first_name) setUserName(capitalizeWords(data.first_name));
        else if (data.username) setUserName(data.username);
        if (data.email) setUserEmail(data.email);
        setIsAdmin(Boolean(data.is_staff || data.is_superuser));
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to restore logged-in user state', error);
        setIsLoggedIn(false);
        setIsAdmin(false);
      } finally {
        setAuthChecked(true);
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
          <Navbar isLoggedIn={isAuthenticated} userName={userName} isAdmin={isAdmin} />
          <CartDrawer />
          <ChatWidget />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} setUserName={setUserName} setUserEmail={setUserEmail} />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} setUserName={setUserName} setUserEmail={setUserEmail} />} />
            <Route path="/dashboard" element={
              (token && !authChecked) ? (
                <div className="loading-screen">Loading account...</div>
              ) : isAuthenticated ? (
                <Dashboard
                  setIsLoggedIn={setIsLoggedIn}
                  setIsAdmin={setIsAdmin}
                  userName={userName}
                  setUserName={setUserName}
                  userEmail={userEmail}
                  setUserEmail={setUserEmail}
                />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} setUserName={setUserName} setUserEmail={setUserEmail} />
              )
            } />
            <Route path="/admin" element={
              <RequireAdmin isAdmin={isAdmin} authChecked={authChecked}>
                <AdminDashboardLayout userName={userName} />
              </RequireAdmin>
            }>
              <Route index element={<AdminOverview />} />
              <Route path="overview" element={<AdminOverview />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
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
          <BackToTop />
        </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  );
}

export default App;