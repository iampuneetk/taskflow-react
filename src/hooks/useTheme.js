import { useContext } from "react";
import ThemeContext from "../context/ThemeContext.jsx";

function useTheme() {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}

export default useTheme;