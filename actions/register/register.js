"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function registerUser(data) {
  try {
    const { name, email, password, confirmPassword } = data;

    // Валидация паролей
    if (password !== confirmPassword) {
      return { error: "Пароли не совпадают" };
    }

    // Проверка существования пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // Если пользователь существует и имеет пароль
    if (existingUser && existingUser.password) {
      return { error: "Пользователь с этим email уже зарегистрирован" };
    }

    // Если пользователь существует через социальный вход
    if (existingUser && !existingUser.password) {
      return { error: "Этот email используется для социального входа" };
    }

    // Хеширование пароля
    const hashedPassword = await hash(password, 12);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return {
      error: error.message || "Произошла ошибка при регистрации",
    };
  }
}
