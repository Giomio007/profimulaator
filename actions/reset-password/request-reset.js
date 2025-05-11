"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Настройки транспорта nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: process.env.EMAIL_SERVER_SECURE === "true",
});

export async function requestPasswordReset(data) {
  try {
    const { email } = data;

    if (!email) {
      return { error: "Email обязателен" };
    }

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Для безопасности возвращаем success даже если пользователь не найден
      return { success: true };
    }

    // Удаляем старые токены для этого пользователя
    await prisma.resetToken.deleteMany({
      where: { userId: user.id },
    });

    // Создаем новый токен
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Токен валиден 1 час

    // Сохраняем токен в базе данных
    await prisma.resetToken.create({
      data: {
        token,
        expires: expiresAt,
        userId: user.id,
      },
    });

    // Формируем ссылку для сброса пароля
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

    // Отправляем письмо
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Сброс пароля",
      text: `Для сброса пароля перейдите по ссылке: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #6c5ce7;">Сброс пароля</h2>
          <p>Вы запросили сброс пароля. Для создания нового пароля перейдите по ссылке ниже:</p>
          <p><a href="${resetUrl}" style="display: inline-block; background-color: #6c5ce7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Сбросить пароль</a></p>
          <p>Ссылка действительна в течение 1 часа.</p>
          <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Ошибка сброса пароля:", error);
    return {
      error: "Произошла ошибка при сбросе пароля",
    };
  }
}
