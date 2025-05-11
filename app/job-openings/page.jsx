"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";

const JobOpenings = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const [vacancyDetails, setVacancyDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setVacancyDetails: setStoreVacancy, setQuizQuestions } =
    useAssessmentStore();

  // components/JobOpenings.js
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Очищаем хранилище полностью перед добавлением новой вакансии
      useAssessmentStore.getState().clearStore();
      setStoreVacancy(vacancyDetails); // Сохраняем только в хранилище
      router.push("/LoadingQuestions"); // Простой переход без параметров
    } catch (error) {
      console.error("Ошибка:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="pt-40 py-16"
      style={{ backgroundColor: isDark ? "#121212" : "#ffffff" }}
    >
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <div className="max-w-2xl mb-12 text-center">
          <h2
            className="text-center mb-8 relative pb-4"
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: isDark ? "#e0e0e0" : "#333333",
            }}
          >
            Загрузите вакансию
            <span
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              style={{
                width: "80px",
                height: "4px",
                backgroundColor: isDark ? "#a29bfe" : "#6c5ce7",
              }}
            />
          </h2>
          <p
            className="text-lg"
            style={{ color: isDark ? "#a0a0a0" : "#666666" }}
          >
            Вставьте или напишите детали вашей вакансии ниже.
          </p>
        </div>

        <textarea
          value={vacancyDetails}
          onChange={(e) => setVacancyDetails(e.target.value)}
          placeholder="Введите или вставьте детали вакансии..."
          className="w-full max-w-4xl h-96 p-4 mb-8 rounded-md resize-none outline-none focus:outline-none"
          style={{
            backgroundColor: isDark ? "#1e1e1e" : "#f7f7f7",
            color: isDark ? "#e0e0e0" : "#333333",
            borderColor: isDark ? "#2c2c2c" : "#e0e0e0",
          }}
        />

        <div className="flex justify-end w-full max-w-4xl">
          <Link
            href="/"
            className="px-8 py-3 rounded-md mr-4 text-center font-medium transition-colors hover:bg-[#5a4cd1]"
            style={{ backgroundColor: "#6c5ce7", color: "#ffffff" }}
          >
            Назад
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 rounded-md text-center font-medium transition-colors hover:bg-[#5a4cd1] disabled:opacity-50"
            style={{ backgroundColor: "#6c5ce7", color: "#ffffff" }}
          >
            {isSubmitting ? "Генерация..." : "Продолжить"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobOpenings;
