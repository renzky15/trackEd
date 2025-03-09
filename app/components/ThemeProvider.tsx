"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "caramel" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "caramel",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("caramel");

  useEffect(() => {
    // Get the initial theme
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "caramel");

    // Set theme in state and DOM
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);

    // Add transition classes
    document.documentElement.classList.add("transition-colors", "duration-200");

    return () => {
      document.documentElement.classList.remove(
        "transition-colors",
        "duration-200"
      );
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "caramel" ? "dark" : "caramel";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div suppressHydrationWarning>{children}</div>
    </ThemeContext.Provider>
  );
}
