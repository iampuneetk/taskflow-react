import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const savedValue = localStorage.getItem(key);

      if (savedValue === null) {
        return initialValue;
      }

      const parsedValue = JSON.parse(savedValue);

      return parsedValue;
    } catch (error) {
      console.error(`Could not read "${key}" from Local Storage:`, error);

      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Could not save "${key}" to Local Storage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;