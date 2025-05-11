const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Checking users...");
    const users = await prisma.user.findMany();
    console.log("Users count:", users.length);
    console.log("Users:", users);

    // Проверим, есть ли пользователь с нужным ID
    const userID = "cmabia1ic0006fnt4molqnwif"; // ID из логов
    const user = await prisma.user.findUnique({
      where: { id: userID },
    });

    console.log(`Пользователь с ID ${userID}:`, user ? "Найден" : "НЕ НАЙДЕН");

    if (!user) {
      // Если пользователя нет, создадим его (тест)
      const newUser = await prisma.user.create({
        data: {
          id: userID,
          name: "Test User",
          email: "test@example.com",
        },
      });
      console.log("Создан тестовый пользователь:", newUser);
    }
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
