"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { getDetailedResults } from "@/actions/evaluation/evaluation";

const ReviewAnswers = () => {
  const { isDark } = useTheme();
  const { results, clearStore, setResults } = useAssessmentStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isResultsLoaded, setIsResultsLoaded] = useState(false);

  // Попробовать загрузить результаты из API, если они не найдены в хранилище
  useEffect(() => {
    const fetchResultsIfNeeded = async () => {
      // Если уже есть результаты в хранилище и они соответствуют запрашиваемому quizId
      if (results && results.quizId === quizId) {
        setIsResultsLoaded(true);
        return;
      }

      // Если есть quizId, пробуем получить результаты по API
      if (quizId) {
        try {
          setLoading(true);
          setError(null);

          console.log("Загружаем результаты для квиза:", quizId);
          const data = await getDetailedResults(quizId);

          if (data) {
            console.log("Результаты получены:", data);
            // Сохраняем полученные результаты в хранилище
            setResults({
              title: data.title || "Результаты оценки",
              quizId: data.quizId,
              score: data.score,
              summary: data.summary,
              recommendations: data.recommendations,
              details: data.details,
              vacancyDetails: data.vacancyDetails,
            });
            setIsResultsLoaded(true);
          } else {
            setError("Результаты не найдены");
          }
        } catch (err) {
          console.error("Ошибка загрузки результатов:", err);
          setError(err.message || "Ошибка загрузки результатов");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResultsIfNeeded();
  }, [quizId, results, setResults]);

  // Устанавливаем флаг перехода при первой загрузке
  useEffect(() => {
    if (
      window.location.pathname.includes("/ReviewAnswers") &&
      document.referrer.includes("/CheckingAnswers")
    ) {
      sessionStorage.setItem("fromCheckingAnswers", "true");
    }
  }, []);

  // Эффект для обработки навигации
  useEffect(() => {
    // Проверяем, откуда пришел пользователь - если с /CheckingAnswers, устанавливаем флаг
    // для предотвращения мгновенного редиректа
    const fromCheckingAnswers = sessionStorage.getItem("fromCheckingAnswers");

    // Сохраняем информацию о текущем состоянии в sessionStorage
    if (isResultsLoaded && results) {
      sessionStorage.setItem("reviewAnswersVisited", "true");
      sessionStorage.setItem("lastQuizId", quizId);
      // Очищаем флаг перехода с CheckingAnswers
      sessionStorage.removeItem("fromCheckingAnswers");
    }

    // Проверяем, что загрузка результатов завершена и quizId не существует
    // Но не перенаправляем, если пользователь только что пришел с CheckingAnswers
    if (!loading && !results && !error && !quizId && !fromCheckingAnswers) {
      router.push("/job-openings");
    }
  }, [loading, results, error, router, isResultsLoaded, quizId]);

  // Очистка хранилища при размонтировании компонента
  useEffect(() => {
    // При переходе по кнопке назад, добавляем обработчик события popstate
    const handlePopState = () => {
      // Не очищаем хранилище если переходим обратно на страницу с результатами
      if (
        !window.location.pathname.includes("/ReviewAnswers") &&
        !window.location.pathname.includes("/dashboard") &&
        !window.location.pathname.includes("/profile")
      ) {
        clearStore();
        sessionStorage.removeItem("reviewAnswersVisited");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      // Очищаем хранилище только если переходим не на страницу ReviewAnswers, dashboard или profile
      if (
        !window.location.pathname.includes("/ReviewAnswers") &&
        !window.location.pathname.includes("/dashboard") &&
        !window.location.pathname.includes("/profile")
      ) {
        clearStore();
        sessionStorage.removeItem("reviewAnswersVisited");
      }
    };
  }, [clearStore]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
            style={{ color: isDark ? "#a29bfe" : "#6c5ce7" }}
          ></div>
          <p className="mt-2" style={{ color: isDark ? "#e0e0e0" : "#333333" }}>
            Загрузка результатов...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <Link
            href="/"
            className="mt-4 px-8 py-3 rounded-md text-center font-medium inline-block bg-[#6c5ce7] text-white"
          >
            На главную
          </Link>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const textColor = isDark ? "#e0e0e0" : "#333333";
  const accentColor = isDark ? "#a29bfe" : "#6c5ce7";

  return (
    <section
      className="pt-20 sm:pt-32 md:pt-40 py-8 sm:py-12 md:py-16 transition-colors duration-300"
      style={{ backgroundColor: isDark ? "#121212" : "#ffffff" }}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 transition-colors duration-300 break-words"
            style={{ color: textColor }}
          >
            <span className="block md:inline">Результаты оценки:</span>{" "}
            <span className="block md:inline">{results?.title}</span>
          </h2>

          {/* Отображаем score если доступно */}
          {results?.score !== undefined && (
            <div
              className="mb-6 sm:mb-8 md:mb-12 p-4 sm:p-5 md:p-6 rounded-lg transition-colors duration-300"
              style={{
                backgroundColor: isDark ? "#1e1e1e" : "#f7f7f7",
                color: textColor,
              }}
            >
              <h3
                className="text-lg sm:text-xl font-semibold mb-3 md:mb-4 transition-colors duration-300"
                style={{ color: accentColor }}
              >
                Оценка
              </h3>
              <div className="mb-3 md:mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Результат:</span>
                  <span
                    className="text-xl sm:text-2xl font-bold"
                    style={{
                      color:
                        results.score >= 70
                          ? "#4CAF50"
                          : results.score >= 50
                          ? "#FFC107"
                          : "#F44336",
                    }}
                  >
                    {results.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${results.score}%`,
                      backgroundColor:
                        results.score >= 70
                          ? "#4CAF50"
                          : results.score >= 50
                          ? "#FFC107"
                          : "#F44336",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Блок общей оценки */}
          <div
            className="mb-6 sm:mb-8 md:mb-12 p-4 sm:p-5 md:p-6 rounded-lg transition-colors duration-300"
            style={{
              backgroundColor: isDark ? "#1e1e1e" : "#f7f7f7",
              color: textColor,
            }}
          >
            <h3
              className="text-lg sm:text-xl font-semibold mb-3 md:mb-4 transition-colors duration-300"
              style={{ color: accentColor }}
            >
              Общая оценка
            </h3>
            <p className="whitespace-pre-wrap text-sm sm:text-base">
              {results?.summary}
            </p>
          </div>

          {/* Блок рекомендаций */}
          <div
            className="mb-6 sm:mb-8 md:mb-12 p-4 sm:p-5 md:p-6 rounded-lg transition-colors duration-300"
            style={{
              backgroundColor: isDark ? "#1e1e1e" : "#f7f7f7",
              color: textColor,
            }}
          >
            <h3
              className="text-lg sm:text-xl font-semibold mb-3 md:mb-4 transition-colors duration-300"
              style={{ color: accentColor }}
            >
              Рекомендации
            </h3>
            <p className="whitespace-pre-wrap text-sm sm:text-base">
              {results?.recommendations}
            </p>
          </div>

          {/* Блок детального анализа */}
          <div
            className="mb-6 sm:mb-8 md:mb-12 p-4 sm:p-5 md:p-6 rounded-lg transition-colors duration-300"
            style={{
              backgroundColor: isDark ? "#1e1e1e" : "#f7f7f7",
              color: textColor,
            }}
          >
            <h3
              className="text-lg sm:text-xl font-semibold mb-3 md:mb-4 transition-colors duration-300"
              style={{ color: accentColor }}
            >
              Детальный анализ
            </h3>
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {results?.details?.split("\n\n").map((item, index) => {
                const [question, answer, rating, comment] = item.split("\n");
                return (
                  <div
                    key={index}
                    className="p-3 sm:p-4 rounded-md border transition-colors duration-300 text-sm sm:text-base"
                    style={{
                      backgroundColor: isDark ? "#2c2c2c" : "#ffffff",
                      borderColor: isDark ? "#404040" : "#e0e0e0",
                    }}
                  >
                    {question && (
                      <div className="mb-2 sm:mb-3">
                        <span
                          className="font-semibold"
                          style={{ color: accentColor }}
                        >
                          {question.split(":")[0]}:{" "}
                        </span>
                        <span className="break-words">
                          {question.split(":")[1]?.trim()}
                        </span>
                      </div>
                    )}
                    {answer && (
                      <div className="mb-2 sm:mb-3">
                        <span
                          className="font-semibold"
                          style={{ color: accentColor }}
                        >
                          {answer.split(":")[0]}:{" "}
                        </span>
                        <span className="break-words">
                          {answer.split(":")[1]?.trim()}
                        </span>
                      </div>
                    )}
                    {rating && (
                      <div className="mb-2 sm:mb-3">
                        <span
                          className="font-semibold"
                          style={{ color: accentColor }}
                        >
                          {rating.split(":")[0]}:{" "}
                        </span>
                        <span
                          style={{
                            color: rating.toLowerCase().includes("хорошо")
                              ? "#4CAF50"
                              : rating.toLowerCase().includes("нормально")
                              ? "#FFC107"
                              : "#F44336",
                          }}
                        >
                          {rating.split(":")[1]?.trim()}
                        </span>
                      </div>
                    )}
                    {comment && (
                      <div
                        className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t"
                        style={{ borderColor: isDark ? "#404040" : "#e0e0e0" }}
                      >
                        <span
                          className="font-semibold"
                          style={{ color: accentColor }}
                        >
                          {comment.split(":")[0]}:{" "}
                        </span>
                        <span className="break-words">
                          {comment.split(":")[1]?.trim()}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center sm:justify-end">
            <Link
              href="/job-openings"
              className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-md text-center font-medium transition-colors duration-300 hover:bg-[#5a4cd1]"
              style={{
                backgroundColor: isDark ? "#6c5ce7" : "#a29bfe",
                color: "#ffffff",
              }}
              onClick={() => {
                // Явно очищаем хранилище и данные сессии при переходе на новое собеседование
                clearStore();
                sessionStorage.removeItem("reviewAnswersVisited");
                sessionStorage.removeItem("lastQuizId");
              }}
            >
              Новое собеседование
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewAnswers;
