import { useEffect } from "react";

export function usePageTitle(title) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = title;
    }
  }, [title]);
}
