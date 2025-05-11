"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const servicesData = [
  {
    title: "Технические собеседования",
    description:
      "Специализированная подготовка к техническим ролям, включая задачи по программированию, вопросы по системному дизайну и обсуждение алгоритмов.",
  },
  {
    title: "Поведенческие собеседования",
    description:
      "Практика ответов на вопросы в формате STAR, которые оценивают ваши мягкие навыки, прошлый опыт и то, как вы справляетесь с рабочими ситуациями.",
  },
  {
    title: "Оценка лидерства",
    description:
      "Комплексная подготовка к управленческим и руководящим должностям, с акцентом на стиль руководства, стратегическое мышление и управление командой.",
  },
  {
    title: "Коучинг по собеседованиям",
    description:
      "Индивидуальные коучинг-сессии с экспертами по карьере для улучшения навыков собеседования, языка тела и коммуникационных техник.",
  },
  {
    title: "Анализ резюме",
    description:
      "Анализ резюме с помощью ИИ, который помогает оптимизировать ваше резюме для систем отслеживания кандидатов и выделяет области для улучшения.",
  },
  {
    title: "Тренировочные собеседования",
    description:
      "Реалистичные симуляции собеседований с вопросами, специфичными для отрасли, и всесторонней обратной связью для повышения вашей уверенности.",
  },
];

const ServicesSection = () => {
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
      id="services"
      className="py-16"
      style={{ backgroundColor: isDark ? "#1e1e1e" : "#f7f7f7" }}
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
          Услуги по подготовке к собеседованию
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="p-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg h-full flex flex-col"
              style={{
                backgroundColor: isDark ? "#121212" : "#ffffff",
                color: isDark ? "#e0e0e0" : "#333333",
                minHeight: "300px",
              }}
            >
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: isDark ? "#a29bfe" : "#6c5ce7" }}
              >
                {service.title}
              </h3>
              <p
                className="mb-6 flex-grow"
                style={{
                  color: isDark ? "#a0a0a0" : "#666666",
                  lineHeight: "1.6",
                }}
              >
                {service.description}
              </p>
              <div className="mt-auto">
                <a
                  href="#home"
                  className="font-semibold cursor-pointer"
                  style={{ color: isDark ? "#a29bfe" : "#6c5ce7" }}
                >
                  Узнать больше →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="#"
            className="inline-block py-3 px-6 rounded-md font-semibold text-white transition-all duration-300 hover:translate-y-[-2px] shadow-lg"
            style={{
              backgroundColor: "#6c5ce7",
              boxShadow: "0 5px 15px rgba(108, 92, 231, 0.3)",
            }}
          >
            Посмотреть все услуги
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
