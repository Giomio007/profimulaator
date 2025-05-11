"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Ошибка авторизации
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {error || "Произошла ошибка при попытке авторизации"}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Link
            href="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6c5ce7] hover:bg-[#5a4cd1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6c5ce7]"
          >
            Вернуться на страницу входа
          </Link>
        </div>
      </div>
    </div>
  );
}
