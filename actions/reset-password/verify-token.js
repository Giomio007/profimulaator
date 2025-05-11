"use server";

import { prisma } from "@/lib/prisma";

export async function verifyResetToken(token) {
  try {
    if (!token) {
      return { isValid: false, error: "Токен не предоставлен" };
    }

    // Находим активный токен
    const resetToken = await prisma.resetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return { isValid: false, error: "Недействительный токен сброса пароля" };
    }

    // Проверяем срок действия токена
    if (resetToken.expires < new Date()) {
      return { isValid: false, error: "Срок действия токена истек" };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Ошибка проверки токена:", error);
    return {
      isValid: false,
      error: "Произошла ошибка при проверке токена",
    };
  }
}
