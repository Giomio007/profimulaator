"use client";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { useEffect, useState } from "react";

const SimulatorSection = () => {
  const { isDark } = useTheme();
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsNarrowScreen(window.innerWidth < 370);
    };

    // Проверяем при монтировании
    checkScreenSize();

    // Добавляем обработчик ресайза
    window.addEventListener("resize", checkScreenSize);

    // Убираем обработчик при размонтировании
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <section
      id="simulator"
      className="py-16"
      style={{
        backgroundColor: isDark ? "#1e1e1e" : "#f7f7f7",
        padding: "4rem 0",
      }}
    >
      <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
        <h2
          className="text-center mb-8 relative pb-4"
          style={{
            fontSize: isNarrowScreen ? "1.8rem" : "2.5rem",
            fontWeight: 700,
            color: isDark ? "#e0e0e0" : "#333333",
          }}
        >
          Симулятор собеседования
          <span
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            style={{
              width: "80px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: isDark ? "#a29bfe" : "#6c5ce7",
            }}
          />
        </h2>

        <div
          className="bg-white rounded-xl shadow-lg p-6 mx-auto "
          style={{
            maxWidth: "2000px",
            backgroundColor: isDark ? "#121212" : "#ffffff",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="text-center">
            <div className="mb-6 " style={{ color: isDark ? "#fff" : "#000" }}>
              <img
                src="/assets/interview-minimal.svg"
                alt="Превью собеседования"
                className="mx-auto"
                style={{ width: "200px", height: "auto" }}
              />
            </div>

            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: isDark ? "#e0e0e0" : "#333333" }}
            >
              Подготовьтесь к собеседованию с Профимулятором
            </h3>

            <p
              className="mb-8 text-lg"
              style={{
                color: isDark ? "#a0a0a0" : "#666666",
                lineHeight: 1.6,
                maxWidth: "600px",
                margin: "0 auto",
                marginBottom: "20px",
              }}
            >
              Практикуйтесь с нашим интеллектуальным интервьюером, который
              адаптируется к вашим ответам и дает полезные рекомендации.
            </p>

            <div
              className="flex flex-col gap-4 my-8"
              style={{ maxWidth: "500px", margin: "0 auto" }}
            >
              {[
                "Более 500 вопросов по различным специальностям",
                "Детальный анализ ваших ответов",
                "Сохранение результатов в личном кабинете",
              ].map((text, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                  style={{ color: isDark ? "#e0e0e0" : "#333333" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isDark ? "#a29bfe" : "#6c5ce7"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span style={{ fontSize: "1rem" }}>{text}</span>
                </div>
              ))}
            </div>

            <Link
              href="/profession-selection"
              className="inline-block px-8 py-3 mt-7 rounded-md font-medium transition-all duration-300"
              style={{
                backgroundColor: "#6c5ce7",
                color: "#ffffff",
                border: "none",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0 5px 15px rgba(108, 92, 231, 0.3)",
                transform: "translateY(0)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              Начать собеседование
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimulatorSection;
