"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Пути, запрещённые для авторизованных пользователей
const restrictedPathsForAuth = ["/login", "/register"];
// Пути, доступные для неавторизованных пользователей
const allowedPathsForUnauth = ["/", "/login", "/register"];

export default function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Для авторизованных пользователей
    if (session?.user) {
      // Блокируем доступ к страницам логина и регистрации
      if (restrictedPathsForAuth.includes(pathname)) {
        router.push("/dashboard");
      }
    }
    // Для неавторизованных пользователей
    else {
      // Проверяем доступ к запрашиваемому пути
      if (!allowedPathsForUnauth.includes(pathname)) {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      }
    }
  }, [status, session, pathname, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
