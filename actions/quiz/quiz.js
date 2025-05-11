"use server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const createQuiz = async (title, questions, vacancyDetails) => {
  try {
    // Получаем текущую сессию и проверяем авторизацию
    const session = await getServerSession(authOptions);
    console.log("Session в createQuiz:", JSON.stringify(session, null, 2));

    const userId = session?.user?.id;
    console.log("User ID из сессии:", userId);

    if (!userId) throw new Error("Требуется авторизация");
    if (!title || !questions) throw new Error("Неверные данные для квиза");

    // Проверяем формат вопросов и преобразуем их в нужный вид
    let questionsArray;
    if (Array.isArray(questions)) {
      if (questions[0]?.create) {
        // Если вопросы в формате Prisma
        questionsArray = questions.map((q) => q.create.text);
      } else if (questions[0]?.question) {
        // Если вопросы в формате {question, category}
        questionsArray = questions.map((q) => q.question);
      } else {
        // Если вопросы уже в виде строк
        questionsArray = questions;
      }
    } else {
      throw new Error("Неверный формат вопросов");
    }

    // Фильтруем пустые значения
    questionsArray = questionsArray.filter((q) => q && q.trim() !== "");

    if (questionsArray.length === 0) {
      throw new Error("Нет валидных вопросов для сохранения");
    }

    // Проверяем, существует ли уже квиз с подобным описанием вакансии в течение последних 10 минут
    // Это поможет предотвратить дублирование при обновлении страницы или перезапусках
    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        userId: userId,
        vacancyDetails: vacancyDetails,
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000), // 10 минут
        },
        // Проверка, что оценка еще не выставлена (квиз не завершен)
        score: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (existingQuiz) {
      console.log(
        "Найден существующий незавершенный квиз, возвращаем его ID:",
        existingQuiz.id
      );
      return existingQuiz.id;
    }

    // Если существующего квиза нет, создаем новый
    const quiz = await prisma.quiz.create({
      data: {
        title: title,
        vacancyDetails: vacancyDetails,
        questions: questionsArray,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return quiz.id;
  } catch (error) {
    console.error("Ошибка создания квиза:", error);
    throw new Error(`Не удалось сохранить вопросы: ${error.message}`);
  }
};

export const getQuiz = async (quizId) => {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session в getQuiz:", JSON.stringify(session, null, 2));

    const userId = session?.user?.id;
    console.log("User ID из сессии в getQuiz:", userId);

    if (!userId) throw new Error("Требуется авторизация");

    const quiz = await prisma.quiz.findUniqueOrThrow({
      where: {
        id: quizId,
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        questions: true,
        createdAt: true,
        vacancyDetails: true,
      },
    });

    // Преобразуем массив строк в массив объектов с явным свойством question
    const formattedQuestions = quiz.questions.map((question, index) => ({
      question: question,
      category: "Технические", // По умолчанию, так как категории не сохраняются
      order: index + 1,
    }));

    console.log(
      "Форматированные вопросы в getQuiz:",
      JSON.stringify(formattedQuestions, null, 2)
    );

    return {
      ...quiz,
      questions: formattedQuestions,
    };
  } catch (error) {
    console.error("Ошибка получения квиза:", error);
    throw new Error("Не удалось загрузить вопросы");
  }
};
