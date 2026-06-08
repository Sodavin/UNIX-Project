import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "unix-wishlist";

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to read wishlist from storage", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addToWishlist = (product) => {
    setItems((currentItems) => {
      if (currentItems.some((item) => item.id === product.id)) {
        return currentItems;
      }
      return [...currentItems, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const clearWishlist = () => setItems([]);

  const isWishlisted = (productId) => items.some((item) => item.id === productId);

  const value = {
    items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isWishlisted,
    itemCount: items.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
