import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "./cart/CartContext";
import { useWishlist } from "./Wishlist/WishlistContext";
import "./css/Layout.css";

function Navbar({ isLoggedIn, userName, isAdmin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isFilterPage = ["/Men-Clothing", "/Women-Clothing"].some((p) => location.pathname.startsWith(p));
  const searchParams = new URLSearchParams(location.search);
  const currentQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(currentQuery);
  const { count, openCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const accountRef = useRef(null);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    setSearchTerm(currentQuery);
  }, [currentQuery]);

  // Close account dropdown when clicking outside or when route changes
  useEffect(() => {
    const onDocClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    const onRouteChange = () => setAccountOpen(false);
    document.addEventListener('click', onDocClick);
    window.addEventListener('popstate', onRouteChange);
    return () => {
      document.removeEventListener('click', onDocClick);
      window.removeEventListener('popstate', onRouteChange);
    };
  }, []);

  const updateQueryParam = (value) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    const queryString = params.toString();
    navigate(`${location.pathname}${queryString ? `?${queryString}` : ""}`, { replace: true });
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    updateQueryParam(value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    updateQueryParam(searchTerm.trim());
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <p>FREE SHIPPING ON ORDERS OVER $50</p>
      </div>

      {/* NAVBAR */}
      <nav className={`navbar ${isFilterPage ? "" : "sticky"}`}>
        <Link
          to="/"
          className="logo"
          onClick={() => {
            // Ensure we always scroll to top when the logo is clicked
            try {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (e) {
              window.scrollTo(0, 0);
            }
          }}
        >
          <img src="/logo.png" alt="UNIX Logo" />
          <h1>UNIX</h1>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/Men-Clothing">MEN</Link>
          </li>
          <li>
            <Link to="/Women-Clothing">WOMEN</Link>
          </li>
          <li>
            <Link to="/About">ABOUT</Link>
          </li>
          <li>
            <Link to="/Contact">CONTACT</Link>
          </li>
        </ul>

        <form className="search-box" onSubmit={handleSearchSubmit}>
          <Search size={18} />

          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search products"
          />
        </form>

        <div className="nav-icons">
          <Link to="/wishlist" className="icon wishlist-link" aria-label="Wishlist">
            <Heart size={18} />
            {wishlistCount > 0 ? <span className="wishlist-badge">{wishlistCount}</span> : null}
          </Link>

          {isLoggedIn ? (
            isAdmin ? (
              <div className="account" ref={accountRef}>
                <button
                  type="button"
                  className="icon account-toggle logged-in-account"
                  aria-expanded={accountOpen}
                  aria-label={userName ? `Hi, ${userName.split(" ")[0]}` : "Account"}
                  onClick={() => setAccountOpen((s) => !s)}
                >
                  <User size={20} />
                  {userName ? (
                    <span className="account-name logged-in-name">{`Hi, ${userName.split(" ")[0]}`}</span>
                  ) : null}
                </button>

                <div className={`account-dropdown ${accountOpen ? 'open' : ''}`} role="menu">
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setAccountOpen(false)}>Account Dashboard</Link>
                  <Link to="/admin" className="dropdown-item" onClick={() => setAccountOpen(false)}>Admin Dashboard</Link>
                </div>
              </div>
            ) : (
              <Link
                to="/dashboard"
                className="icon account-toggle logged-in-account"
                aria-label={userName ? `Hi, ${userName.split(" ")[0]}` : "Account"}
              >
                <User size={20} />
                {userName ? (
                  <span className="account-name logged-in-name">{`Hi, ${userName.split(" ")[0]}`}</span>
                ) : null}
              </Link>
            )
          ) : (
            <div className="account" ref={accountRef}>
              <button
                type="button"
                className="icon account-toggle"
                aria-expanded={accountOpen}
                aria-label="Open account menu"
                onClick={() => setAccountOpen((s) => !s)}
              >
                <User size={20} />
                <span className="account-label">ACCOUNT</span>
              </button>

              <div className={`account-dropdown ${accountOpen ? 'open' : ''}`} role="menu">
                <Link to="/signup" className="dropdown-item" onClick={() => setAccountOpen(false)}>Sign up</Link>
                <Link to="/login" className="dropdown-item" onClick={() => setAccountOpen(false)}>Login</Link>
              </div>
            </div>
          )}

          <button className="icon cart-icon" type="button" onClick={openCart} aria-label="Open cart drawer">
            <ShoppingCart size={22} />
            <span>{count}</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;