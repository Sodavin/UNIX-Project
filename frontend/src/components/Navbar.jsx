import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User, ShoppingCart } from "lucide-react";
import "./css/Layout.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(currentQuery);

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
      <nav className="navbar">
        <div className="logo">
          {/* <link to="/"> */}
            <img src="/logo.png" alt="UNIX Logo" />
            <h1>UNIX</h1>
          {/* </link> */}
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/Men-Clothing">MEN</Link>
          </li>
          <li>
            <Link to="/Women-Clothing">WOMEN</Link>
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