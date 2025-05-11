"use client";

import React, { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAssessmentStore } from "@/store/assessment-store";
import { generateQuestions } from "@/actions/questions/questions";
import { createQuiz } from "@/actions/quiz/quiz";
import { prisma } from "@/lib/prisma";

const LoadingQuestions = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const { setQuizTitle, setQuizQuestions, vacancyDetails } =
    useAssessmentStore();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const generateAndProcessQuestions = async () => {
      try {
        if (!vacancyDetails?.trim()) {
          throw new Error("Пожалуйста, введите описание вакансии");
        }

        // Генерируем вопросы и название
        const result = await generateQuestions(vacancyDetails);

        if (result.error) {
          throw new Error(result.error);
        }

        // Проверяем наличие хотя бы 3 вопросов
        const hasEnoughQuestions =
          result.rawQuestions?.length >= 3 || result.questions?.length >= 3;

        if (!hasEnoughQuestions) {
          throw new Error(
            "Не удалось сгенерировать достаточно вопросов. Попробуйте более подробное описание вакансии."
          );
        }

        // Сохраняем в хранилище
        setQuizTitle(result.title || "Собеседование");
        setQuizQuestions(result.rawQuestions || []);

        // Создаем квиз в базе данных
        const quizId = await createQuiz(
          result.title || "Собеседование",
          result.rawQuestions || result.questions || [],
          vacancyDetails
        );

        // Перенаправляем на страницу вопросов с ID квиза
        router.replace(`/questions?quizId=${quizId}`);
      } catch (error) {
        console.error("Ошибка:", error);
        const errorMessage = encodeURIComponent(
          error.message || "Ошибка генерации вопросов"
        );
        router.push(`/error?message=${errorMessage}`);
      }
    };

    if (status === "authenticated" && vacancyDetails) {
      console.log(
        "Session в LoadingQuestions:",
        JSON.stringify(session, null, 2)
      );
      console.log("User ID в LoadingQuestions:", session?.user?.id);
      generateAndProcessQuestions();
    }
  }, [
    status,
    router,
    session?.user?.id,
    vacancyDetails,
    setQuizTitle,
    setQuizQuestions,
  ]);

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
            Генерация вопросов
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
          <p
            className="text-lg mb-8"
            style={{ color: isDark ? "#a0a0a0" : "#666666" }}
          >
            Подождите, идет создание персонализированного собеседования...
          </p>
        </div>
        <div
          className="animate-spin rounded-full h-16 w-16 border-b-4"
          style={{ borderColor: isDark ? "#a29bfe" : "#6c5ce7" }}
        />
      </div>
    </section>
  );
};

export default LoadingQuestions;
