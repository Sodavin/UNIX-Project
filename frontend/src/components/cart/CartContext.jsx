import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "unix-fashion-cart";

const normalizeKey = (item) => `${item.id}-${item.size || "default"}-${item.color || "default"}`;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to read cart from storage", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((value) => !value);

  const addItem = (product, quantity = 1) => {
    setItems((currentItems) => {
      const nextItems = [...currentItems];
      const productKey = normalizeKey(product);
      const existingIndex = nextItems.findIndex((item) => normalizeKey(item) === productKey);

      if (existingIndex >= 0) {
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: Number(nextItems[existingIndex].quantity || 1) + Number(quantity),
        };
      } else {
        nextItems.push({
          ...product,
          quantity: Number(quantity),
        });
      }

      return nextItems;
    });
  };

  const removeItem = (product) => {
    setItems((currentItems) => currentItems.filter((item) => normalizeKey(item) !== normalizeKey(product)));
  };

  const updateQuantity = (product, delta) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => {
          if (normalizeKey(item) !== normalizeKey(product)) return item;
          return {
            ...item,
            quantity: Math.max(1, Number(item.quantity || 1) + Number(delta)),
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const updateItemOptions = (product, changes) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (normalizeKey(item) !== normalizeKey(product)) return item;
        return {
          ...item,
          ...changes,
        };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode("");
    setDiscount(0);
  };

  const applyPromoCode = (code) => {
    const normalized = String(code || "").trim().toUpperCase();
    if (!normalized) {
      setPromoCode("");
      setDiscount(0);
      return { success: false, message: "Enter a valid promo code." };
    }

    if (normalized === "UNIX10") {
      setPromoCode(normalized);
      setDiscount(10);
      return { success: true, message: "$10 discount applied." };
    }

    if (normalized === "FREESHIP") {
      setPromoCode(normalized);
      setDiscount(0);
      return { success: true, message: "Shipping is already free." };
    }

    setPromoCode(normalized);
    setDiscount(0);
    return { success: false, message: "Promo code not recognized." };
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0),
    [items]
  );

  const count = useMemo(() => items.reduce((sum, item) => sum + Number(item.quantity || 1), 0), [items]);

  const shipping = 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      shipping,
      discount,
      total,
      promoCode,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      updateItemOptions,
      clearCart,
      applyPromoCode,
    }),
    [items, count, subtotal, shipping, discount, total, promoCode, isCartOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
