"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getResults } from "@/actions/evaluation/evaluation";
import Image from "next/image";

const Dashboard = () => {
  const { isDark } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");

    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getResults();
        setResults(data);
      } catch (err) {
        console.error("Ошибка при загрузке результатов:", err);
        setError(err.message || "Не удалось загрузить результаты");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchResults();
    }
  }, [status, router]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Функция вычисления среднего балла
  function getAverageScore(quizzes) {
    if (!quizzes || quizzes.length === 0) return 0;

    let totalScore = 0;
    let quizzesWithScore = 0;

    quizzes.forEach((quiz) => {
      if (quiz.score !== null && quiz.score !== undefined) {
        totalScore += quiz.score;
        quizzesWithScore++;
      }
    });

    return quizzesWithScore > 0 ? Math.round(totalScore / quizzesWithScore) : 0;
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center pt-20 pb-16"
        style={{
          backgroundColor: isDark ? "#121212" : "#ffffff",
          color: isDark ? "#e0e0e0" : "#333333",
        }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: isDark ? "#6c5ce7" : "#6c5ce7" }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center pt-20 pb-16"
        style={{
          backgroundColor: isDark ? "#121212" : "#ffffff",
          color: isDark ? "#e0e0e0" : "#333333",
        }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ошибка</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 rounded-md"
            style={{
              backgroundColor: isDark ? "#6c5ce7" : "#6c5ce7",
              color: "#ffffff",
            }}
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-28 pb-16"
      style={{ backgroundColor: isDark ? "#121212" : "#f8f9fa" }}
    >
      <div className="container mx-auto px-4">
        <div
          className="mx-auto overflow-hidden rounded-lg shadow-lg"
          style={{
            backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
            color: isDark ? "#e0e0e0" : "#333333",
          }}
        >
          <div className="flex flex-col md:flex-row">
            {/* Боковая панель */}
            <div
              className="md:w-1/4 p-6 border-r"
              style={{
                borderColor: isDark ? "#333333" : "#e5e7eb",
              }}
            >
              <div className="user-profile flex flex-col items-center text-center mb-8">
                <div className="user-avatar-large w-24 h-24 mb-4 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Пользователь"}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </div>
                <h3 className="user-fullname text-xl font-semibold">
                  {session?.user?.name || "Пользователь"}
                </h3>
                <p className="user-email text-sm opacity-75 mt-1">
                  {session?.user?.email}
                </p>
              </div>
              <nav className="profile-nav">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className={`w-full text-left flex items-center p-3 rounded-md transition-colors ${
                        activeTab === "dashboard" ? "font-medium" : ""
                      }`}
                      style={{
                        backgroundColor:
                          activeTab === "dashboard"
                            ? isDark
                              ? "#333333"
                              : "#f3f4f6"
                            : "transparent",
                        color:
                          activeTab === "dashboard"
                            ? isDark
                              ? "#e0e0e0"
                              : "#333333"
                            : isDark
                            ? "#a0a0a0"
                            : "#666666",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-3"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      <span>Панель управления</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Основной контент */}
            <div className="md:w-3/4 p-6">
              {/* Панель управления */}
              {activeTab === "dashboard" && (
                <div className="dashboard-content">
                  <div className="content-header mb-8">
                    <h2 className="text-2xl font-bold mb-2">
                      Панель управления
                    </h2>
                    <p>
                      Добро пожаловать, {session?.user?.name}! Вот краткая
                      сводка вашей активности и статистики.
                    </p>
                  </div>

                  <div className="user-stats grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div
                      className="stat-card p-4 rounded-lg flex flex-row sm:flex-col items-center justify-between sm:justify-center"
                      style={{
                        backgroundColor: isDark ? "#252525" : "#ffffff",
                        border: `1px solid ${isDark ? "#333333" : "#e5e7eb"}`,
                      }}
                    >
                      <h3 className="text-lg font-semibold sm:mb-2">
                        Собеседований
                      </h3>
                      <p className="text-3xl font-bold">
                        {results?.length || 0}
                      </p>
                    </div>
                    <div
                      className="stat-card p-4 rounded-lg flex flex-row sm:flex-col items-center justify-between sm:justify-center"
                      style={{
                        backgroundColor: isDark ? "#252525" : "#ffffff",
                        border: `1px solid ${isDark ? "#333333" : "#e5e7eb"}`,
                      }}
                    >
                      <h3 className="text-lg font-semibold sm:mb-2">
                        Средний балл
                      </h3>
                      <p className="text-3xl font-bold">
                        {getAverageScore(results)}%
                      </p>
                    </div>
                  </div>

                  <div className="interviews-section mb-8">
                    <h3 className="text-xl font-semibold mb-4">
                      История собеседований
                    </h3>
                    {results.length > 0 ? (
                      <div className="interview-list grid grid-cols-1 gap-4">
                        {results.map((quiz) => (
                          <div
                            key={quiz.id}
                            onClick={() =>
                              router.push(`/ReviewAnswers?quizId=${quiz.id}`)
                            }
                            className="interview-item p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between transition-all hover:shadow-md cursor-pointer"
                            style={{
                              backgroundColor: isDark ? "#252525" : "#ffffff",
                              border: `1px solid ${
                                isDark ? "#333333" : "#e5e7eb"
                              }`,
                            }}
                          >
                            <div className="interview-details mb-3 md:mb-0">
                              <h4 className="font-semibold">
                                {quiz.title || "Собеседование"}
                              </h4>
                              <p className="text-sm opacity-75 mt-1">
                                {formatDate(quiz.createdAt)}
                              </p>
                              <p
                                className="text-sm mt-1"
                                style={{
                                  color: isDark ? "#a0a0a0" : "#666666",
                                }}
                              >
                                {quiz.vacancyDetails?.length > 100
                                  ? quiz.vacancyDetails.substring(0, 100) +
                                    "..."
                                  : quiz.vacancyDetails}
                              </p>
                            </div>
                            <div className="interview-score flex items-center">
                              {quiz.score !== null ? (
                                <div className="flex items-center">
                                  <div className="progress-bar w-28 h-2 rounded-full bg-gray-200 mr-3">
                                    <div
                                      className="progress h-full rounded-full"
                                      style={{
                                        width: `${quiz.score}%`,
                                        backgroundColor: isDark
                                          ? "#6c5ce7"
                                          : "#6c5ce7",
                                      }}
                                    ></div>
                                  </div>
                                  <span className="font-medium">
                                    {quiz.score}%
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm opacity-75">
                                  Не оценено
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="text-center py-8 rounded-lg"
                        style={{
                          backgroundColor: isDark ? "#252525" : "#f3f4f6",
                        }}
                      >
                        <p className="mb-4">
                          У вас пока нет пройденных собеседований
                        </p>
                        <Link
                          href="/"
                          className="px-6 py-2 rounded-md inline-block"
                          style={{
                            backgroundColor: isDark ? "#6c5ce7" : "#6c5ce7",
                            color: "#ffffff",
                          }}
                        >
                          Начать собеседование
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="action-buttons">
                    <Link
                      href="/"
                      className="px-6 py-3 rounded-md inline-flex items-center"
                      style={{
                        backgroundColor: isDark ? "#6c5ce7" : "#6c5ce7",
                        color: "#ffffff",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <span>Новое собеседование</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
