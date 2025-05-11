"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function resetPassword({ token, password }) {
  try {
    if (!token || !password) {
      return { error: "Токен и пароль обязательны" };
    }

    // Находим активный токен
    const resetToken = await prisma.resetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return { error: "Недействительный токен сброса пароля" };
    }

    // Проверяем срок действия токена
    if (resetToken.expires < new Date()) {
      return { error: "Срок действия токена истек" };
    }

    // Хешируем новый пароль
    const hashedPassword = await hash(password, 12);

    // Обновляем пароль пользователя
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Удаляем использованный токен
    await prisma.resetToken.delete({
      where: { id: resetToken.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Ошибка установки нового пароля:", error);
    return {
      error: "Произошла ошибка при установке нового пароля",
    };
  }
}
