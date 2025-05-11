"use client";

import { useTheme } from "@/context/ThemeContext";
import { useAssessmentStore } from "@/store/assessment-store";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Hero = () => {
  const { isDark } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { clearStore } = useAssessmentStore();

  return (
    <section
      id="home"
      className="pt-40 py-16"
      style={{ backgroundColor: isDark ? "#121212" : "#ffffff" }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Текстовый контент */}
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: isDark ? "#e0e0e0" : "#333333" }}
          >
            Симулятор собеседования с ИИ
          </h2>
          <p
            className="text-lg mb-8"
            style={{ color: isDark ? "#a0a0a0" : "#666666" }}
          >
            Готовьтесь к своему следующему собеседованию с помощью нашей
            передовой технологии ИИ. Получайте обратную связь в режиме реального
            времени, персонализированные советы и повышайте уверенность перед
            настоящим собеседованием.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={"/job-openings"}
              onClick={clearStore}
              className="px-8 py-3 rounded-md text-center font-medium transition-colors hover:bg-[#5a4cd1]"
              style={{
                backgroundColor: "#6c5ce7",
                color: "#ffffff",
              }}
            >
              Попробовать симулятор
            </Link>
            <a
              href={"#features"}
              className={`px-8 py-3 rounded-md text-center font-medium border transition-colors ${
                isDark ? " dark:hover:bg-gray-800" : "hover:bg-gray-100"
              }  `}
              style={{
                color: isDark ? "#e0e0e0" : "#6c5ce7",
                borderColor: isDark ? "#2c2c2c" : "#6c5ce7",
              }}
            >
              Узнать больше
            </a>
          </div>
        </div>

        {/* SVG изображение */}
        <div className="md:w-1/2 flex justify-center">
          <svg
            width="400"
            height="300"
            viewBox="0 0 500 400"
            fill="none"
            stroke={isDark ? "#a29bfe" : "#6c5ce7"}
            strokeWidth="2"
            className="max-w-full h-auto"
          >
            <rect x="50" y="50" width="400" height="300" rx="10" />
            <line x1="100" y1="100" x2="400" y2="100" />
            <circle cx="350" cy="75" r="15" />
            <rect x="100" y="150" width="80" height="30" rx="5" />
            <rect x="250" y="150" width="120" height="30" rx="5" />
            <rect x="100" y="200" width="150" height="30" rx="5" />
            <rect x="100" y="250" width="250" height="30" rx="5" />
            <circle cx="450" cy="200" r="10" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
