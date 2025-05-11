"use client";

import { getQuiz } from "@/actions/quiz/quiz";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const QuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const quizId = searchParams.get("quizId");
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError("");

        // Валидация параметров
        if (!quizId) {
          throw new Error("Не указан идентификатор теста");
        }

        if (status === "unauthenticated") {
          router.push("/login");
          return;
        }

        // Запрос данных
        const quizData = await getQuiz(quizId);

        if (!quizData) {
          throw new Error("Тест не найден");
        }

        if (!quizData.questions?.length) {
          throw new Error("Вопросы не найдены");
        }

        setQuiz(quizData);
      } catch (err) {
        console.error("Ошибка:", err);
        setError(err.message);
        router.push(`/error?message=${encodeURIComponent(err.message)}`);
      } finally {
        setLoading(false);
      }
    };

    if (userId && quizId) {
      fetchQuiz();
    }
  }, [status, quizId, userId, router]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h2 className="text-xl font-bold mb-2">Ошибка</h2>
        <p>{error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Список вопросов</h1>
      <div className="space-y-4">
        {quiz.questions.map((question, index) => (
          <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
            <p className="font-medium text-lg mb-2">Вопрос {index + 1}:</p>
            <p className="text-gray-700">{question}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizPage;
