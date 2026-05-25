import { Search, User, ShoppingCart } from "lucide-react";
import "./Layout.css";

function Navbar() {
  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <p>FREE SHIPPING ON ORDERS OVER $50</p>
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <h1>UNIX</h1>
        </div>

        <ul className="nav-links">
          <li>MEN</li>
          <li>WOMEN</li>
        </ul>

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search for products..."
          />
        </div>

        <div className="nav-icons">
          <User size={20} className="icon" />

          <button className="login-btn">
            LOGIN
          </button>

          <button className="signup-btn">
            SIGN UP
          </button>

          <div className="cart-icon">
            <ShoppingCart size={22} />
            <span>0</span>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;