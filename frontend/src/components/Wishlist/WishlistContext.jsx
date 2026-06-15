import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);
const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

function getAuthToken() {
  const token = window.localStorage.getItem("authToken");
  return token && token.trim() !== "" && token.trim().toLowerCase() !== "null" && token.trim().toLowerCase() !== "undefined"
    ? token.trim()
    : null;
}

export function WishlistProvider({ children }) {
  const [token, setToken] = useState(() => getAuthToken());
  const [items, setItems] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(getAuthToken());
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setItems([]);
      setIsHydrated(true);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const response = await fetch(`${API}/api/user/wishlist/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          setItems([]);
          return;
        }

        const data = await response.json();
        setItems(Array.isArray(data.products) ? data.products : []);
      } catch (error) {
        console.error("Failed to load wishlist from server", error);
        setItems([]);
      } finally {
        setIsHydrated(true);
      }
    };

    fetchWishlist();
  }, [token]);

  const addToWishlist = async (product) => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API}/api/user/wishlist/add/${product.id}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to add product to wishlist", response.status);
          return;
        }

        setItems((currentItems) => {
          if (currentItems.some((item) => item.id === product.id)) {
            return currentItems;
          }
          return [...currentItems, product];
        });
        return;
      } catch (error) {
        console.error("Failed to add product to wishlist", error);
        return;
      }
    }

    setItems((currentItems) => {
      if (currentItems.some((item) => item.id === product.id)) {
        return currentItems;
      }
      return [...currentItems, product];
    });
  };

  const removeFromWishlist = async (productId) => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API}/api/user/wishlist/remove/${productId}/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to remove product from wishlist", response.status);
          return;
        }
      } catch (error) {
        console.error("Failed to remove product from wishlist", error);
        return;
      }
    }

    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const clearWishlist = async () => {
    const token = getAuthToken();
    if (token) {
      const currentIds = items.map((item) => item.id);
      await Promise.all(
        currentIds.map((productId) =>
          fetch(`${API}/api/user/wishlist/remove/${productId}/`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }).catch((error) => console.error("Failed to clear wishlist item", productId, error))
        )
      );
    }

    setItems([]);
  };

  const isWishlisted = (productId) => items.some((item) => item.id === productId);

  const value = {
    items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isWishlisted,
    itemCount: items.length,
    isHydrated,
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
