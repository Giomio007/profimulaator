"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const AboutSection = () => {
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
      id="about"
      className="py-16"
      style={{ backgroundColor: isDark ? "#121212" : "#ffffff" }}
    >
      <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-center mb-8 relative pb-4"
            style={{
              fontSize: isNarrowScreen ? "1.8rem" : "2.5rem",
              fontWeight: 700,
              color: isDark ? "#e0e0e0" : "#333333",
            }}
          >
            О проекте Профимулятор
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

          <div className="space-y-6">
            <p
              style={{
                color: isDark ? "#a0a0a0" : "#666666",
                lineHeight: "1.6",
                textAlign: "center",
              }}
            >
              Профимулятор был разработан, чтобы помочь соискателям обрести
              уверенность и эффективно подготовиться к собеседованиям. Наша
              платформа с искусственным интеллектом предоставляет реалистичные
              симуляции собеседований, персонализированную обратную связь и
              вопросы для конкретных отраслей, чтобы помочь вам выделиться на
              конкурентном рынке труда.
            </p>

            <p
              style={{
                color: isDark ? "#a0a0a0" : "#666666",
                lineHeight: "1.6",
                textAlign: "center",
              }}
            >
              Используя передовые технологии обработки естественного языка и
              машинного обучения, наша система анализирует ваши ответы, тон и
              содержание, чтобы предоставить практические рекомендации, которые
              улучшают вашу эффективность на собеседовании.
            </p>
          </div>

          <div className="flex justify-around flex-wrap mt-12">
            {/* Статистика может быть добавлена здесь */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
