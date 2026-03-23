import { useEffect, useState } from "react";

export function useDebounceSearch<T>(initialValue: T, delay: number = 500) {
  const [debouncedSearch, setDebouncedSearch] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(initialValue);
    }, delay);

    return () => clearTimeout(handler);
  }, [initialValue, delay]);
  return {
    debouncedSearch,
  };
}
