"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function evaluateAnswers(
  vacancyDetails,
  questions,
  answers,
  quizId
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("Необходима авторизация");
    }

    const userId = session.user.id;

    if (!vacancyDetails?.trim()) {
      return { error: "Отсутствует описание вакансии" };
    }

    if (!questions || !questions.length) {
      return { error: "Отсутствуют вопросы" };
    }

    if (!answers || !answers.length) {
      return { error: "Отсутствуют ответы" };
    }

    // Подготовка данных для запроса к API
    const limitedDetails = vacancyDetails.slice(0, 2000);

    // Обработка вопросов разных форматов
    const questionsAndAnswers = questions.map((q, index) => {
      // Проверяем все возможные форматы хранения вопроса
      const questionText = typeof q === "object" ? q.question || q.text : q;

      return {
        question: questionText || `Вопрос ${index + 1}`,
        answer: answers[index] || "Нет ответа",
      };
    });

    console.log(
      "Подготовленные вопросы и ответы:",
      JSON.stringify(questionsAndAnswers, null, 2)
    );

    const prompt = `Проанализируй ответы кандидата на вопросы собеседования для позиции и дай оценку.

Описание вакансии:
${limitedDetails}

Вопросы и ответы:
${questionsAndAnswers
  .map(
    (qa, i) =>
      `${i + 1}. Вопрос: ${qa.question || "Не указан"}\nОтвет: ${qa.answer}`
  )
  .join("\n\n")}

Требуется выполнить:
1. Общая оценка: дай процентную оценку от 0 до 100%, насколько хорошо кандидат прошел собеседование.
2. Общее резюме: краткое резюме сильных и слабых сторон ответов кандидата (2-3 предложения).
3. Рекомендации: список конкретных областей для улучшения (не более 3 пунктов).
4. Детальный анализ: для каждого вопроса и ответа предоставь:
   - Оценку (Хорошо/Нормально/Плохо)
   - Краткий комментарий с объяснением оценки

Формат ответа:
{
  "score": число от 0 до 100,
  "summary": "текст общего резюме",
  "recommendations": "список рекомендаций в формате нумерованного списка",
  "details": "детальный анализ в формате 'Вопрос: текст вопроса\\nОтвет: ответ\\nОценка: оценка\\nКомментарий: комментарий\\n\\n' для каждого вопроса"
}`;

    if (!process.env.IOINTELLIGENCE_API_KEY) {
      return {
        error: "API ключ не настроен. Пожалуйста, проверьте настройки сервера.",
      };
    }

    const response = await fetch(
      "https://api.intelligence.io.solutions/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.IOINTELLIGENCE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-R1",
          messages: [
            {
              role: "system",
              content:
                "Ты - эксперт по оценке кандидатов на собеседованиях. Твоя задача - дать объективную и конструктивную оценку ответов кандидата на вопросы собеседования.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Ошибка API оценки ответов");
    }

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices.length) {
      return { error: "Неверный формат ответа от сервера оценки" };
    }

    const generatedText = data.choices[0]?.message?.content;

    if (!generatedText) {
      return { error: "Не получили ответ от сервера оценки" };
    }

    // Парсинг результатов
    let parsedResult;
    try {
      parsedResult = JSON.parse(generatedText);

      // Проверка обязательных полей
      if (
        typeof parsedResult.score !== "number" ||
        !parsedResult.summary ||
        !parsedResult.recommendations ||
        !parsedResult.details
      ) {
        throw new Error("Неполные данные от сервера оценки");
      }

      // Преобразование рекомендаций из массива в строку, если необходимо
      const recommendationsText = Array.isArray(parsedResult.recommendations)
        ? parsedResult.recommendations.join("\n")
        : parsedResult.recommendations;

      // Преобразуем вопросы в формат для сохранения в БД
      const questionsForDb = questions.map((q) => {
        if (typeof q === "object") {
          return q.question || q.text || JSON.stringify(q);
        }
        return q;
      });

      // Если предоставлен quizId, используем его для поиска квиза напрямую
      let targetQuiz = null;

      if (quizId) {
        // Проверяем существует ли квиз с указанным ID и принадлежит ли он текущему пользователю
        targetQuiz = await prisma.quiz.findFirst({
          where: {
            id: quizId,
            userId: userId,
          },
        });

        if (targetQuiz) {
          console.log("Найден квиз по ID для обновления:", targetQuiz.id);
        }
      }

      // Если квиз по ID не найден, ищем по другим критериям
      if (!targetQuiz) {
        // Проверяем, существует ли уже квиз с такими же вопросами и описанием вакансии для данного пользователя
        // Это поможет предотвратить создание дубликатов при множественных вызовах
        targetQuiz = await prisma.quiz.findFirst({
          where: {
            userId: userId,
            vacancyDetails: vacancyDetails,
            createdAt: {
              // Проверяем созданные за последние 2 минуты
              gte: new Date(Date.now() - 2 * 60 * 1000),
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }

      // Если квиз найден, обновляем его данные
      if (targetQuiz) {
        console.log(
          "Найден существующий квиз, обновляем его данные:",
          targetQuiz.id
        );

        // Сохраняем новые результаты оценки в существующий квиз
        // Это обеспечит актуальность данных, если оценка изменилась
        await prisma.quiz.update({
          where: { id: targetQuiz.id },
          data: {
            score: parsedResult.score,
            summary: parsedResult.summary,
            recommendations: recommendationsText,
            details: parsedResult.details,
          },
        });

        return {
          quizId: targetQuiz.id,
          score: parsedResult.score,
          summary: parsedResult.summary,
          recommendations: recommendationsText,
          details: parsedResult.details,
          vacancyDetails: targetQuiz.vacancyDetails,
        };
      }

      // Если квиз не найден, создаем новый
      console.log("Создание нового квиза с результатами...");

      // Если такого квиза нет, создаем новую запись в БД
      const quizResult = await prisma.quiz.create({
        data: {
          title: "Результаты оценки",
          questions: questionsForDb,
          vacancyDetails,
          score: parsedResult.score,
          summary: parsedResult.summary,
          recommendations: recommendationsText,
          details: parsedResult.details,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return {
        quizId: quizResult.id,
        score: parsedResult.score,
        summary: parsedResult.summary,
        recommendations: recommendationsText,
        details: parsedResult.details,
        vacancyDetails: vacancyDetails,
      };
    } catch (error) {
      console.error("Ошибка при обработке ответа:", error, generatedText);
      return { error: "Не удалось обработать результаты оценки" };
    }
  } catch (error) {
    console.error("Ошибка оценки:", error);
    return {
      error:
        error.message ||
        "Ошибка при оценке ответов. Пожалуйста, попробуйте еще раз.",
    };
  }
}

export async function getDetailedResults(quizId) {
  try {
    if (!quizId) {
      throw new Error("ID квиза не указан");
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("Необходима авторизация");
    }

    // В findUnique мы не можем использовать составное условие с user,
    // поэтому переходим на findFirst
    const quizResult = await prisma.quiz.findFirst({
      where: {
        id: quizId,
        userId: session.user.id,
      },
    });

    if (!quizResult) {
      throw new Error("Результаты не найдены");
    }

    return {
      quizId: quizResult.id,
      title: quizResult.title || "Результаты оценки",
      score: quizResult.score,
      summary: quizResult.summary,
      recommendations: quizResult.recommendations,
      details: quizResult.details,
      vacancyDetails: quizResult.vacancyDetails,
      createdAt: quizResult.createdAt,
    };
  } catch (error) {
    console.error("Ошибка получения результатов:", error);
    throw error;
  }
}

export async function getResults() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("Необходима авторизация");
    }

    const results = await prisma.quiz.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        score: true,
        summary: true,
        recommendations: true,
        createdAt: true,
        vacancyDetails: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return results.map((result) => ({
      id: result.id,
      quizId: result.id,
      title: result.title || "Результаты оценки",
      score: result.score,
      recommendations: result.recommendations,
      createdAt: result.createdAt,
      vacancyDetails: result.vacancyDetails,
    }));
  } catch (error) {
    console.error("Ошибка получения результатов:", error);
    throw error;
  }
}
