"use client";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyResetToken } from "@/actions/reset-password/verify-token";
import { resetPassword } from "@/actions/reset-password/reset-password";

const ResetPasswordPage = ({ params }) => {
  const { token } = params;
  const { isDark } = useTheme();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const router = useRouter();

  // Проверяем валидность токена при загрузке страницы
  useEffect(() => {
    const checkToken = async () => {
      try {
        const result = await verifyResetToken(token);
        setIsTokenValid(result.isValid);
        if (!result.isValid) {
          setError(result.error);
        }
      } catch (error) {
        setIsTokenValid(false);
        setError("Произошла ошибка при проверке токена");
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Пароль должен содержать не менее 8 символов");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    try {
      const result = await resetPassword({ token, password });

      if (result.error) {
        if (
          result.error.includes("Недействительный токен") ||
          result.error.includes("Срок действия токена истек")
        ) {
          setIsTokenValid(false);
        }
        throw new Error(result.error);
      }

      setSuccess(true);

      // После успешного сброса перенаправляем на страницу входа через 3 секунды
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Показываем индикатор загрузки, пока проверяем токен
  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6c5ce7]"></div>
      </div>
    );
  }

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
              Создание нового пароля
            </h2>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Введите новый пароль для вашей учетной записи
            </p>
          </div>

          {!isTokenValid ? (
            <div className="text-center">
              <div className="mb-4 text-red-500">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p
                className={`text-lg mb-4 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Недействительная или устаревшая ссылка
              </p>
              <p
                className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Ссылка для сброса пароля недействительна или срок её действия
                истек. Пожалуйста, запросите новую ссылку.
              </p>
              <Link
                href="/forgot-password"
                className="w-full inline-block bg-[#6c5ce7] hover:bg-[#5a4cd1] text-white py-3 px-4 rounded-lg transition-colors font-medium text-center"
              >
                Запросить новую ссылку
              </Link>
            </div>
          ) : success ? (
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
                Пароль успешно обновлен!
              </p>
              <p
                className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Теперь вы можете войти в свою учетную запись, используя новый
                пароль.
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Перенаправление на страницу входа...
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Новый пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-[#a29bfe] text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 focus:ring-[#6c5ce7] text-gray-800 placeholder-gray-500"
                    }`}
                    placeholder="Введите новый пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute duration-150 right-3 top-2 p-2 ${
                      isDark ? "hover:bg-[#35353692]" : "hover:bg-gray-100"
                    } rounded-full`}
                    aria-label={
                      showPassword ? "Скрыть пароль" : "Показать пароль"
                    }
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-[14px] text-[#747474] mt-1">
                  Минимум 8 символов
                </p>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Подтверждение пароля
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-[#a29bfe] text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 focus:ring-[#6c5ce7] text-gray-800 placeholder-gray-500"
                    }`}
                    placeholder="Подтвердите новый пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute duration-150 right-3 top-2 p-2 ${
                      isDark ? "hover:bg-[#35353692]" : "hover:bg-gray-100"
                    } rounded-full`}
                    aria-label={
                      showConfirmPassword ? "Скрыть пароль" : "Показать пароль"
                    }
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6c5ce7] hover:bg-[#5a4cd1] text-white py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Обновление..." : "Обновить пароль"}
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

export default ResetPasswordPage;
