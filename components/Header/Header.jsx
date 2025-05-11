"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { signOut, useSession } from "next-auth/react";

const Header = ({ page }) => {
  const { isDark, setIsDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMinText, setIsMinText] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsMinText(window.innerWidth < 340);
    };

    // Проверяем при монтировании
    checkScreenSize();

    // Добавляем обработчик ресайза
    window.addEventListener("resize", checkScreenSize);

    // Убираем обработчик при размонтировании
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(savedTheme ? savedTheme === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const navLinks = [
    { href: "#home", text: "Главная" },
    { href: "#features", text: "Функции" },
    { href: "#services", text: "Услуги" },
    { href: "#about", text: "О проекте" },
  ];

  const handleLogout = async () => {
    // Сохраняем текущую тему перед выходом
    const currentTheme = isDark ? "dark" : "light";
    await signOut({ callbackUrl: "/" });
    localStorage.setItem("theme", currentTheme);
  };

  return (
    <header
      className="fixed top-0 w-full shadow-md z-50"
      style={{ backgroundColor: isDark ? "#121212" : "#ffffff" }}
    >
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <div className="flex items-center space-x-2">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDark ? "#a29bfe" : "#6c5ce7"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
              <path d="M9.5 13.5L7 17" />
              <path d="M14.5 13.5L17 17" />
              <path d="M12 12v4" />
              <path d="M10 7.5l2-2.5 2 2.5" />
            </svg>
            <span
              className="font-bold"
              style={{
                color: isDark ? "#a29bfe" : "#6c5ce7",
                fontSize: isMinText ? "1rem" : "1.25rem", // Уменьшаем при очень маленьких экранах
              }}
            >
              <Link href={"/"}>Профимулятор</Link>
            </span>
          </div>

          {/* Десктопное меню (скрывается на мобильных) */}

          {page && !isMobile && (
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative transition-colors group"
                  style={{ color: isDark ? "#e0e0e0" : "#666666" }}
                >
                  {link.text}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: isDark ? "#a29bfe" : "#6c5ce7" }}
                  />
                </a>
              ))}
            </div>
          )}

          {/* Правая часть */}
          <div className="flex items-center space-x-4">
            {/* Кнопки авторизации (скрываются на мобильных) */}
            {page && !isMobile && (
              <div className="flex space-x-3">
                {session?.user ? (
                  <>
                    <Link
                      href={"/dashboard"}
                      className="px-4 py-2 rounded-md transition-colors border"
                      style={{
                        color: isDark ? "#e0e0e0" : "#333333",
                        borderColor: isDark ? "#2c2c2c" : "#e0e0e0",
                        backgroundColor: isDark ? "#1e1e1e" : "transparent",
                      }}
                    >
                      Кабинет
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-md transition-colors"
                      style={{
                        backgroundColor: "#6c5ce7",
                        color: "#ffffff",
                      }}
                    >
                      Выход
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={"/login"}
                      className="px-4 py-2 rounded-md transition-colors border"
                      style={{
                        color: isDark ? "#e0e0e0" : "#333333",
                        borderColor: isDark ? "#2c2c2c" : "#e0e0e0",
                        backgroundColor: isDark ? "#1e1e1e" : "transparent",
                      }}
                    >
                      Вход
                    </Link>
                    <Link
                      href={"/register"}
                      className="px-4 py-2 rounded-md transition-colors"
                      style={{
                        backgroundColor: "#6c5ce7",
                        color: "#ffffff",
                      }}
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            )}

            {!page && (
              <Link href="/">
                <button
                  className="p-2 rounded-lg transition-colors ml-auto"
                  style={{
                    backgroundColor: isDark ? "#1e1e1e" : "#f7f7f7",
                    color: isDark ? "#e0e0e0" : "#333333",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isDark ? "#e0e0e0" : "#333333"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
              </Link>
            )}

            {/* Переключатель темы */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: isDark ? "#1e1e1e" : "#f7f7f7",
              }}
            >
              {isDark ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke={isDark ? "#e0e0e0" : "#333333"}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke={isDark ? "#e0e0e0" : "#333333"}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                  />
                </svg>
              )}
            </button>

            {/* Кнопка бургер-меню (показывается только на мобильных) */}
            {page && isMobile && (
              <button
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: isDark ? "#1e1e1e" : "#f7f7f7",
                }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="space-y-1.5">
                  <span
                    className="block w-6 h-0.5"
                    style={{ backgroundColor: isDark ? "#e0e0e0" : "#333333" }}
                  />
                  <span
                    className="block w-6 h-0.5"
                    style={{ backgroundColor: isDark ? "#e0e0e0" : "#333333" }}
                  />
                  <span
                    className="block w-4 h-0.5"
                    style={{ backgroundColor: isDark ? "#e0e0e0" : "#333333" }}
                  />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Мобильное меню (показывается только на мобильных) */}
        {page && isMobile && isMenuOpen && (
          <div
            className="fixed inset-0 bg-white dark:bg-gray-900 p-6 z-50 flex flex-col space-y-8"
            style={{ backgroundColor: isDark ? "#121212" : "#ffffff" }}
          >
            {/* Верхняя часть с логотипом и переключателем темы */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isDark ? "#a29bfe" : "#6c5ce7"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                  <path d="M9.5 13.5L7 17" />
                  <path d="M14.5 13.5L17 17" />
                  <path d="M12 12v4" />
                  <path d="M10 7.5l2-2.5 2 2.5" />
                </svg>
                <span
                  className="font-bold"
                  style={{
                    color: isDark ? "#a29bfe" : "#6c5ce7",
                    fontSize: "1.25rem",
                  }}
                >
                  Профимулятор
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: isDark ? "#1e1e1e" : "#f7f7f7",
                }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke={isDark ? "#e0e0e0" : "#333333"}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Ссылки */}
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2 transition-colors text-lg font-medium"
                  style={{ color: isDark ? "#e0e0e0" : "#666666" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.text}
                </a>
              ))}
            </div>

            <div className="mt-auto flex flex-col space-y-4">
              {session?.user ? (
                <>
                  <Link
                    href={"/dashboard"}
                    className="block w-full px-4 py-2 text-center rounded-md border transition-colors"
                    style={{
                      color: isDark ? "#e0e0e0" : "#333333",
                      borderColor: isDark ? "#2c2c2c" : "#e0e0e0",
                      backgroundColor: isDark ? "#1e1e1e" : "transparent",
                    }}
                  >
                    Кабинет
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-center rounded-md transition-colors"
                    style={{
                      backgroundColor: "#6c5ce7",
                      color: "#ffffff",
                    }}
                  >
                    Выход
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={"/login"}
                    className="block w-full px-4 py-2 text-center rounded-md border transition-colors"
                    style={{
                      color: isDark ? "#e0e0e0" : "#333333",
                      borderColor: isDark ? "#2c2c2c" : "#e0e0e0",
                      backgroundColor: isDark ? "#1e1e1e" : "transparent",
                    }}
                  >
                    Вход
                  </Link>
                  <Link
                    href={"/register"}
                    className="block w-full px-4 py-2 text-center rounded-md transition-colors"
                    style={{
                      backgroundColor: "#6c5ce7",
                      color: "#ffffff",
                    }}
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
