import React, { createContext, useState, useContext, ReactNode } from "react";
import { Appearance } from "react-native";

const defaultTheme = Appearance.getColorScheme() || "light";

const ThemeContext = createContext({
  theme: defaultTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
