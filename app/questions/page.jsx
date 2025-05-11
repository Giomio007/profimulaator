"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessment-store";
import { getQuiz } from "@/actions/quiz/quiz";

const AnswerQuestions = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [progressWidth, setProgressWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const {
    quizQuestions,
    addUserAnswer,
    quizTitle,
    setQuizQuestions,
    setQuizTitle,
    clearStore,
    userAnswers,
    setVacancyDetails,
  } = useAssessmentStore();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (!quizId) {
      router.push("/");
      return;
    }
  }, [status, router, quizId]);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        // Не очищаем хранилище полностью, сохраняем ответы
        useAssessmentStore.setState({
          quizTitle: "",
          quizQuestions: [],
          vacancyDetails: "",
        });

        const quiz = await getQuiz(quizId);
        if (!quiz) throw new Error("Квиз не найден");

        setQuizTitle(quiz.title);
        setQuizQuestions(
          quiz.questions.map((q) => ({
            question: q.question,
            category: q.category,
          }))
        );
        // Устанавливаем vacancyDetails из базы данных
        setVacancyDetails(quiz.vacancyDetails || "");
      } catch (error) {
        console.error("Ошибка загрузки квиза:", error);
        router.push(`/error?message=${encodeURIComponent(error.message)}`);
      } finally {
        setLoading(false);
      }
    };

    if (quizId && session?.user?.id) loadQuiz();
  }, [
    quizId,
    session?.user?.id,
    router,
    setQuizTitle,
    setQuizQuestions,
    setVacancyDetails,
  ]);

  useEffect(() => {
    if (quizQuestions.length > 0) {
      const newProgress =
        ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
      setProgressWidth(newProgress);
    }
  }, [currentQuestionIndex, quizQuestions]);

  const handleNext = () => {
    if (!answer.trim()) {
      alert("Пожалуйста, введите ответ перед продолжением!");
      return;
    }

    addUserAnswer(answer.trim());
    setAnswer("");

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Последний вопрос, проверяем что в quizQuestions действительно объекты с полем question
      console.log(
        "Вопросы перед отправкой:",
        JSON.stringify(quizQuestions, null, 2)
      );
      router.push(`/CheckingAnswers?quizId=${quizId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6c5ce7]"></div>
      </div>
    );
  }

  if (!quizQuestions.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Вопросы не найдены</div>
      </div>
    );
  }

  return (
    <section
      className="pt-60 py-16 mb-48"
      style={{ backgroundColor: isDark ? "#121212" : "#ffffff" }}
    >
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <div className="max-w-2xl mb-12 text-center">
          <h3
            className="text-xl md:text-2xl font-semibold mb-6"
            style={{ color: isDark ? "#e0e0e0" : "#333333" }}
          >
            {quizQuestions[currentQuestionIndex].question}
          </h3>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Введите ваш ответ..."
          className="w-full max-w-4xl h-64 p-4 mb-8 rounded-md resize-none outline-none focus:outline-none"
          style={{
            backgroundColor: isDark ? "#1e1e1e" : "#f7f7f7",
            color: isDark ? "#e0e0e0" : "#333333",
            borderColor: isDark ? "#2c2c2c" : "#e0e0e0",
          }}
        />

        <div className="w-full max-w-4xl mb-8 relative">
          <div
            className="h-2 bg-gray-300 rounded-full"
            style={{ backgroundColor: isDark ? "#2c2c2c" : "#e0e0e0" }}
          />
          <div
            className="absolute left-0 top-0 h-2 bg-[#6c5ce7] rounded-full transition-width duration-300"
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="flex justify-between w-full max-w-4xl">
          <Link
            href="/job-openings"
            className="px-8 py-3 rounded-md text-center font-medium transition-colors hover:bg-[#5a4cd1]"
            style={{ backgroundColor: "#6c5ce7", color: "#ffffff" }}
          >
            Назад
          </Link>
          <button
            className="px-8 py-3 rounded-md text-center font-medium transition-colors hover:bg-[#5a4cd1]"
            style={{ backgroundColor: "#6c5ce7", color: "#ffffff" }}
            onClick={handleNext}
          >
            {currentQuestionIndex < quizQuestions.length - 1
              ? "Следующий"
              : "Завершить"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AnswerQuestions;
