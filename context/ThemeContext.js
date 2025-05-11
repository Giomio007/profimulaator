"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Инициализация темы при загрузке
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialTheme =
      savedTheme !== null ? savedTheme === "dark" : prefersDark;

    setIsDark(initialTheme);
    setIsReady(true);
  }, []);

  // Применяем изменения темы
  useEffect(() => {
    if (!isReady) return;

    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark, isReady]);

  const toggleTheme = () => setIsDark(!isDark);

  // Не рендерим детей пока тема не инициализирована
  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
