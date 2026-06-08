import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Trash2 } from "lucide-react";

function CartItem({ item, onDecrease, onIncrease, onRemove, onOptionChange }) {
  const [sizeOptions, setSizeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const itemRef = useRef(null);

  useEffect(() => {
    if (!item.id) return;

    const API = process.env.REACT_APP_API_URL || "http://localhost:8000";
    fetch(`${API}/api/products/${item.id}/`)
      .then((response) => response.json())
      .then((product) => {
        setSizeOptions(Array.isArray(product.sizes) ? product.sizes : []);
        setColorOptions(Array.isArray(product.colors) ? product.colors : []);
      })
      .catch(() => {
        setSizeOptions([]);
        setColorOptions([]);
      });
  }, [item.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (itemRef.current && !itemRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (type) => {
    setOpenDropdown((current) => (current === type ? null : type));
  };

  const handleOptionSelect = (type, value) => {
    onOptionChange?.({ [type]: value });
    setOpenDropdown(null);
  };

  return (
    <motion.div
      ref={itemRef}
      className="cart-item"
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <div className="cart-item-media">
        <img src={item.image || item.image1 || "https://via.placeholder.com/120"} alt={item.name} />
      </div>
      <div className="cart-item-content">
        <div className="cart-item-title-row">
          <div>
            <h3>{item.name}</h3>
            <p className="cart-item-category">{item.subcategory || item.category || "Fashion"}</p>
          </div>
          <button className="cart-item-remove" type="button" onClick={onRemove} aria-label="Remove item">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="cart-item-meta">
          <div className="cart-item-option custom-dropdown">
            <label htmlFor={`size-dropdown-${item.id}`}>Size</label>
            {sizeOptions.length ? (
              <>
                <button
                  id={`size-dropdown-${item.id}`}
                  type="button"
                  className={`custom-dropdown-trigger ${openDropdown === "size" ? "open" : ""}`}
                  onClick={() => toggleDropdown("size")}
                  aria-haspopup="listbox"
                  aria-expanded={openDropdown === "size"}
                >
                  <span className={`custom-dropdown-value ${!item.size ? "missing-placeholder" : ""}`}>
                    {item.size || "Select Size"}
                  </span>
                  <ChevronDown className={`custom-dropdown-arrow ${openDropdown === "size" ? "open" : ""}`} />
                </button>
                <div
                  className={`custom-dropdown-menu ${openDropdown === "size" ? "open" : ""}`}
                  role="listbox"
                  aria-labelledby={`size-dropdown-${item.id}`}
                >
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className="custom-dropdown-option"
                      onClick={() => handleOptionSelect("size", size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <span className={`custom-dropdown-placeholder ${!item.size ? "missing-placeholder" : ""}`}>
                {item.size || "Select Size"}
              </span>
            )}
          </div>

          <div className="cart-item-option custom-dropdown">
            <label htmlFor={`color-dropdown-${item.id}`}>Color</label>
            {colorOptions.length ? (
              <>
                <button
                  id={`color-dropdown-${item.id}`}
                  type="button"
                  className={`custom-dropdown-trigger ${openDropdown === "color" ? "open" : ""}`}
                  onClick={() => toggleDropdown("color")}
                  aria-haspopup="listbox"
                  aria-expanded={openDropdown === "color"}
                >
                  <span className={`custom-dropdown-value ${!item.color ? "missing-placeholder" : ""}`}>
                    {item.color || "Select Color"}
                  </span>
                  <ChevronDown className={`custom-dropdown-arrow ${openDropdown === "color" ? "open" : ""}`} />
                </button>
                <div
                  className={`custom-dropdown-menu ${openDropdown === "color" ? "open" : ""}`}
                  role="listbox"
                  aria-labelledby={`color-dropdown-${item.id}`}
                >
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="custom-dropdown-option"
                      onClick={() => handleOptionSelect("color", color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <span className={`custom-dropdown-placeholder ${!item.color ? "missing-placeholder" : ""}`}>
                {item.color || "Select Color"}
              </span>
            )}
          </div>
        </div>

        <div className="cart-item-controls">
          <div className="quantity-control">
            <button type="button" onClick={onDecrease} aria-label="Decrease quantity">
              -
            </button>
            <span>{item.quantity || 1}</span>
            <button type="button" onClick={onIncrease} aria-label="Increase quantity">
              +
            </button>
          </div>
          <strong className="cart-item-price">${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</strong>
        </div>
      </div>
    </motion.div>
  );
}

export default CartItem;
