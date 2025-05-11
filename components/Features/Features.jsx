"use client";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";

const Features = () => {
  const { isDark } = useTheme();
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);
  const [isMinTextScreen, setIsMinTextScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsWideScreen(window.innerWidth >= 1350);
      setIsNarrowScreen(window.innerWidth < 700);
      setIsMinTextScreen(window.innerWidth < 370);
    };

    // Проверяем при монтировании
    checkScreenSize();

    // Добавляем обработчик ресайза
    window.addEventListener("resize", checkScreenSize);

    // Убираем обработчик при размонтировании
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const features = [
    {
      icon: (
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
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16l4-4-4-4" />
          <path d="M8 12h8" />
        </svg>
      ),
      title: "Ответы в реальном времени",
      description:
        "Испытайте реалистичные беседы на собеседовании с нашим ИИ, который адаптируется к вашим ответам и задает естественные уточняющие вопросы.",
    },
    {
      icon: (
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
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      ),
      title: "Персонализированная обратная связь",
      description:
        "Получайте подробную обратную связь о вашем выступлении на собеседовании, включая сильные стороны и области для улучшения.",
    },
    {
      icon: (
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
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: "Аналитика производительности",
      description:
        "Отслеживайте свой прогресс с течением времени с подробной аналитикой ваших собеседований и наблюдайте, как вы совершенствуетесь.",
    },
    {
      icon: (
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
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: "Вопросы для конкретных отраслей",
      description:
        "Практикуйтесь с вопросами, адаптированными к вашей конкретной отрасли, должности и уровню опыта для наиболее релевантной подготовки.",
    },
  ];

  return (
    <section
      id="features"
      className="py-[64px] anchor-section"
      style={{ backgroundColor: isDark ? "#121212" : "#ffffff" }}
    >
      <div className="container max-w-[1200px] w-[90%] mx-auto px-[15px]">
        <h2
          className="text-center mb-8 relative pb-4"
          style={{
            fontSize: isMinTextScreen ? "1.8rem" : "2.5rem",
            fontWeight: 700,
            color: isDark ? "#e0e0e0" : "#333333",
          }}
        >
          Ключевые функции
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
          className="grid gap-[32px]"
          style={{
            gridTemplateColumns: isNarrowScreen
              ? "1fr"
              : isWideScreen
              ? "repeat(4, 1fr)"
              : "repeat(2, 1fr)",
            display: "grid",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-[32px] rounded-[8px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-all duration-300 hover:translate-y-[-5px] hover:shadow-[0_8px_15px_rgba(0,0,0,0.1)] flex flex-col"
              style={{
                backgroundColor: isDark ? "#1B1B1B" : "#ffffff",
                minHeight: "320px",
              }}
            >
              <div
                className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-[16px]"
                style={{ backgroundColor: isDark ? "#3d3d3d" : "#f7f7f7" }}
              >
                {feature.icon}
              </div>
              <h3
                className="text-[18px] font-semibold mb-[16px] text-center"
                style={{ color: isDark ? "#ffffff" : "#333333" }}
              >
                {feature.title}
              </h3>
              <p
                className="text-center flex-grow px-2"
                style={{
                  color: isDark ? "#b0b0b0" : "#666666",
                  lineHeight: "1.6",
                  overflowWrap: "break-word",
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
