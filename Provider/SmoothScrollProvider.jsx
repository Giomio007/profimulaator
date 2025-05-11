"use client";

import { useEffect } from "react";

export const SmoothScrollProvider = ({ children }) => {
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;

      e.preventDefault();
      const id = target.getAttribute("href");
      const element = document.querySelector(id);
      if (element) {
        const headerHeight = 40; // Высота вашего header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return children;
};
