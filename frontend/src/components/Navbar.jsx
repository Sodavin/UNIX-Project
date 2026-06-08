import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "./cart/CartContext";
import { useWishlist } from "./WishlistContext";
import "./css/Layout.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFilterPage = ["/Men-Clothing", "/Women-Clothing"].some((p) => location.pathname.startsWith(p));
  const searchParams = new URLSearchParams(location.search);
  const currentQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(currentQuery);
  const { count, openCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  useEffect(() => {
    setSearchTerm(currentQuery);
  }, [currentQuery]);

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
            <Link to="/about">ABOUT</Link>
          </li>
          <li>
            <Link to="/contact">CONTACT</Link>
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

          <User size={20} className="icon" />
          

          <button className="login-btn">
            LOGIN
          </button>

          <button className="signup-btn">
            SIGN UP
          </button>

          <button className="cart-icon" type="button" onClick={openCart} aria-label="Open cart drawer">
            <ShoppingCart size={22} />
            <span>{count}</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;