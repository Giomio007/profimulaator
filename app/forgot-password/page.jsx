"use client";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "@/actions/reset-password/request-reset";

const ForgotPasswordPage = () => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await requestPasswordReset({ email });

      if (result.error) {
        throw new Error(result.error);
      }

      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDark ? "bg-[#121212]" : "bg-white"
      }`}
    >
      <main className="flex-grow container mx-auto px-4 py-32 flex items-center justify-center">
        <div
          className={`w-full max-w-md p-8 rounded-xl shadow-lg ${
            isDark ? "bg-[#1B1B1B]" : "bg-[#ffffff]"
          }`}
        >
          <div className="text-center mb-8">
            <h2
              className={`text-3xl font-bold mb-2 ${
                isDark ? "text-[#c0c0c0]" : "text-[#666666]"
              }`}
            >
              Восстановление пароля
            </h2>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Введите ваш email для получения инструкций по сбросу пароля
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="mb-4 text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p
                className={`text-lg mb-4 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Письмо с инструкциями отправлено!
              </p>
              <p
                className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Проверьте свою электронную почту и следуйте инструкциям для
                сброса пароля.
              </p>
              <Link
                href="/login"
                className="w-full inline-block bg-[#6c5ce7] hover:bg-[#5a4cd1] text-white py-3 px-4 rounded-lg transition-colors font-medium text-center"
              >
                Вернуться на страницу входа
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 focus:ring-[#a29bfe] text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 focus:ring-[#6c5ce7] text-gray-800 placeholder-gray-500"
                  }`}
                  placeholder="Введите ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6c5ce7] hover:bg-[#5a4cd1] text-white py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Отправка..." : "Отправить инструкции"}
              </button>

              <p
                className={`text-center text-sm mt-6 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Вспомнили пароль?{" "}
                <Link
                  href="/login"
                  className={`font-medium ${
                    isDark
                      ? "text-[#a29bfe] hover:text-[#6c5ce7]"
                      : "text-[#6c5ce7] hover:text-[#5a4cd1]"
                  } transition-colors`}
                >
                  Войти
                </Link>
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
