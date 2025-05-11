"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const errorMessage =
    searchParams.get("message") || "Произошла неизвестная ошибка";
  const { isDark } = useTheme();

  return (
    <section
      className="pt-40 py-16 min-h-screen transition-colors duration-300"
      style={{ backgroundColor: isDark ? "#121212" : "#ffffff" }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-6 transition-colors duration-300"
            style={{ color: isDark ? "#e0e0e0" : "#333333" }}
          >
            Ошибка
          </h2>

          <div
            className="mb-12 p-6 rounded-lg transition-colors duration-300"
            style={{
              backgroundColor: isDark ? "#1e1e1e" : "#f7f7f7",
              color: isDark ? "#e0e0e0" : "#333333",
              border: "1px solid #F44336",
            }}
          >
            <p className="text-lg mb-6" style={{ color: "#F44336" }}>
              {decodeURIComponent(errorMessage)}
            </p>

            <Link
              href="/"
              className="px-8 py-3 rounded-md text-center font-medium transition-colors inline-block hover:bg-[#5a4cd1]"
              style={{
                backgroundColor: "#6c5ce7",
                color: "#ffffff",
              }}
            >
              На главную
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
