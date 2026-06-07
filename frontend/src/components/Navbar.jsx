import { Search, User, ShoppingCart } from "lucide-react";
import "./Layout.css";

function Navbar({ setView, isLoggedIn, setIsLoggedIn }) {
  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <p>FREE SHIPPING ON ORDERS OVER $50</p>
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo" style={{ cursor: "pointer" }} onClick={() => setView('home')}>
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
          <User size={20} className="icon" onClick={() => isLoggedIn ? setView('dashboard') : setView('login')} />

          {!isLoggedIn ? (
            <>
              <button className="login-btn" onClick={() => setView('login')}>
                LOGIN
              </button>

              <button className="signup-btn" onClick={() => setView('signup')}>
                REGISTER
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={() => setIsLoggedIn(false)}>
              LOGOUT
            </button>
          )}

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