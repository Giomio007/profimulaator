"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAssessmentStore } from "@/store/assessment-store";
import { evaluateAnswers } from "@/actions/evaluation/evaluation";

const CheckingAnswers = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDark } = useTheme();
  const { vacancyDetails, quizQuestions, userAnswers, setResults, clearStore } =
    useAssessmentStore();
  const quizId = searchParams.get("quizId");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retries, setRetries] = useState(0);
  const [evaluationSent, setEvaluationSent] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Предотвращаем повторную отправку
    if (isSubmitting || evaluationSent) return;

    // Проверяем, есть ли идентификатор квиза
    if (!quizId) {
      router.push("/job-openings");
      return;
    }

    // Ограничиваем максимальное число попыток
    if (retries > 2) return;

    const evaluate = async () => {
      try {
        setIsSubmitting(true);
        setEvaluationSent(true);

        if (!vacancyDetails?.trim()) {
          throw new Error("Отсутствует описание вакансии");
        }
        if (!quizQuestions?.length) {
          throw new Error("Отсутствуют вопросы");
        }
        if (
          !userAnswers?.length ||
          userAnswers.length !== quizQuestions.length
        ) {
          throw new Error("Не все вопросы были отвечены");
        }

        console.log(
          "Отправляемые вопросы на проверку:",
          JSON.stringify(quizQuestions, null, 2)
        );

        // Отправляем на оценку вакансию, вопросы и ответы с идентификатором квиза
        const result = await evaluateAnswers(
          vacancyDetails,
          quizQuestions,
          userAnswers,
          quizId
        );

        if (result.error) {
          throw new Error(result.error);
        }

        // Сохраняем результаты в хранилище
        setResults({
          title: "Результаты оценки",
          quizId: result.quizId,
          score: result.score,
          summary: result.summary,
          recommendations: result.recommendations,
          details: result.details,
          vacancyDetails: result.vacancyDetails,
        });

        // Сохраняем информацию о завершении обработки
        setProcessingComplete(true);

        // Очищаем пользовательские ответы, но сохраняем результаты в хранилище
        localStorage.removeItem("userAnswers");

        // Увеличиваем задержку перед перенаправлением, чтобы данные успели обработаться
        setTimeout(() => {
          // Проверяем, что компонент не размонтирован
          if (window.location.pathname.includes("/CheckingAnswers")) {
            // Устанавливаем флаг, что переходим с CheckingAnswers
            sessionStorage.setItem("fromCheckingAnswers", "true");
            router.push(`/ReviewAnswers?quizId=${result.quizId}`);
          }
        }, 1500); // Увеличиваем задержку до 1.5 секунды
      } catch (error) {
        console.error("Ошибка оценки:", error);
        setIsSubmitting(false);
        setEvaluationSent(false);
        setErrorMessage(error.message || "Ошибка при обработке ответов");

        // Увеличиваем счетчик попыток и пробуем снова через 2 секунды
        setRetries((prev) => prev + 1);
        setTimeout(() => {
          setIsSubmitting(false);
        }, 2000);

        // Если превышено максимальное число попыток, перенаправляем на страницу ошибки
        if (retries >= 2) {
          router.push(
            `/error?message=${encodeURIComponent(
              error.message || "Произошла ошибка при оценке ответов"
            )}`
          );
        }
      }
    };

    evaluate();

    // Предотвращение повторных запросов при выходе со страницы
    return () => {
      setIsSubmitting(true);
      setEvaluationSent(true);
    };
  }, [
    vacancyDetails,
    quizQuestions,
    userAnswers,
    router,
    setResults,
    isSubmitting,
    retries,
    quizId,
    evaluationSent,
  ]);

  return (
    <section
      className="pt-40 py-16 transition-colors duration-300"
      style={{ backgroundColor: isDark ? "#121212" : "#ffffff" }}
    >
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <div className="max-w-2xl mb-12 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6 transition-colors duration-300"
            style={{ color: isDark ? "#e0e0e0" : "#333333" }}
          >
            Анализ ответов
          </h2>
          <p
            className="text-lg mb-8 transition-colors duration-300"
            style={{ color: isDark ? "#a0a0a0" : "#666666" }}
          >
            {processingComplete
              ? "Обработка завершена, перенаправление..."
              : "Идет обработка ваших ответов нейросетью..."}
          </p>
          {errorMessage && (
            <p
              className="text-sm mb-4 transition-colors duration-300"
              style={{ color: isDark ? "#ff6b6b" : "#e74c3c" }}
            >
              {errorMessage}
            </p>
          )}
          {retries > 0 && (
            <p
              className="text-sm mb-4 transition-colors duration-300"
              style={{ color: isDark ? "#a29bfe" : "#6c5ce7" }}
            >
              Повторная попытка {retries}/3...
            </p>
          )}
        </div>
        <div
          className="animate-spin rounded-full h-16 w-16 border-b-4 transition-colors duration-300"
          style={{ borderColor: isDark ? "#a29bfe" : "#6c5ce7" }}
        />
      </div>
    </section>
  );
};

export default CheckingAnswers;
