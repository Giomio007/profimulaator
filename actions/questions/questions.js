"use server";

export const generateQuestions = async (vacancyDetails) => {
  try {
    if (!vacancyDetails?.trim()) {
      return { error: "Пожалуйста, введите описание вакансии" };
    }

    // Ограничиваем длину описания вакансии
    const limitedDetails = vacancyDetails.slice(0, 2000);

    const prompt = `Сгенерируй вопросы для собеседования на основе описания вакансии. Строго следуй формату:

Название: [Краткое название из 3-5 слов, отражающее суть вакансии]

Вопросы:
1. [Вопрос] • [Категория]
2. [Вопрос] • [Категория]
...
10. [Вопрос] • [Категория]

Требования:
- Название должно быть кратким и информативным
- Каждый вопрос должен быть четким и понятным
- Используй только следующие категории: Технические, Поведенческие, Общие
- Вопросы должны быть релевантны описанию вакансии
- Избегай повторяющихся вопросов
- Не используй markdown-разметку
- Проверь грамматику и орфографию

Описание вакансии: ${limitedDetails}`;

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
                "Ты - опытный HR-специалист, который генерирует качественные вопросы для технических собеседований. Твои вопросы должны быть четкими, конкретными и релевантными описанию вакансии. Строго следуй формату и требованиям.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 800,
          top_p: 0.9,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "Ошибка API генерации вопросов"
      );
    }

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2));
    if (!data.choices || !data.choices.length) {
      return { error: "Неверный формат ответа от сервера генерации" };
    }
    const generatedText = data.choices[0]?.message?.content;

    if (!generatedText) {
      return { error: "Не получили ответ от сервера генерации" };
    }

    console.log("Generated Text:", generatedText);

    // Парсинг названия
    const titleMatch = generatedText.match(/Название:\s*(.+?)(\n|$)/i);
    const title = titleMatch?.[1]?.trim().slice(0, 100) || "Собеседование";

    // Парсинг вопросов
    const questions = [];
    const lines = generatedText.split("\n");

    for (const line of lines) {
      // Ищем строки, которые начинаются с цифры и точки
      const match = line.match(
        /^\d+\.\s*(.+?)(?:\s*[•\s]+(Технические|Поведенческие|Общие))?$/i
      );

      if (match) {
        const question = match[1].trim();
        let category = match[2]?.trim();

        // Если категория не указана, определяем её автоматически
        if (!category) {
          if (
            question.match(
              /(техническ|код|api|баз|тест|алгоритм|оптимизац|ssr|csr|typescript|react|next)/i
            )
          ) {
            category = "Технические";
          } else if (
            question.match(
              /(команд|опыт|пример|ситуац|конфликт|решен|обсуж|взаимод|сотрудн)/i
            )
          ) {
            category = "Поведенческие";
          } else {
            category = "Общие";
          }
        }

        // Проверяем качество вопроса
        if (question.length > 10 && !question.includes("???")) {
          questions.push({
            question,
            category,
          });
        }
      }
    }

    console.log("Parsed Questions:", JSON.stringify(questions, null, 2));

    // Если есть хотя бы 3 вопроса, считаем генерацию успешной
    if (questions.length >= 3) {
      // Преобразуем вопросы в формат для Prisma
      const prismaQuestions = questions.map((q, index) => ({
        create: {
          text: q.question,
          category: q.category,
          order: index + 1,
        },
      }));

      return {
        title,
        questions: prismaQuestions,
        rawQuestions: questions,
      };
    }

    // Если вопросов меньше 3, но есть хотя бы один, все равно возвращаем их
    if (questions.length > 0) {
      const prismaQuestions = questions.map((q, index) => ({
        create: {
          text: q.question,
          category: q.category,
          order: index + 1,
        },
      }));

      return {
        title,
        questions: prismaQuestions,
        rawQuestions: questions,
      };
    }

    return {
      error: "Не удалось сгенерировать достаточно качественных вопросов",
      generatedText,
      parsedQuestions: questions,
    };
  } catch (error) {
    console.error("Ошибка генерации:", error);
    return {
      error:
        error.message ||
        "Ошибка генерации. Попробуйте изменить описание вакансии.",
    };
  }
};
