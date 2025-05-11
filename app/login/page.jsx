// app/login/page.jsx
"use client";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Произошла непредвиденная ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signIn("google", { callbackUrl: "/dashboard", redirect: true });
    } catch (error) {
      setError(error.message || "Ошибка входа через Google");
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setError(null);
      await signIn("github", { callbackUrl: "/dashboard", redirect: true });
    } catch (error) {
      setError(error.message || "Ошибка входа через GitHub");
    }
  };

  if (status === "loading") {
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
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-32 flex items-center justify-center">
        {/* Скрытый iframe для защиты от автозаполнения */}
        <iframe
          style={{ display: "none" }}
          name="dummyframe"
          title="Dummy Frame"
        ></iframe>

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
              Вход в систему
            </h2>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Войдите в свой аккаунт, чтобы продолжить
            </p>
          </div>
          <form
            className="space-y-6"
            onSubmit={handleSubmit}
            noValidate
            id="login-form"
            autoComplete="false"
          >
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
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password_custom_field"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 focus:ring-[#a29bfe] text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 focus:ring-[#6c5ce7] text-gray-800 placeholder-gray-500"
                  }`}
                  placeholder="Введите ваш пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-form-type="other"
                  required
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
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className={`rounded ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-[#6c5ce7]"
                      : "border-gray-300 text-[#6c5ce7]"
                  } focus:ring-[#6c5ce7]`}
                />
                <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                  Запомнить меня
                </span>
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6c5ce7] hover:bg-[#5a4cd1] text-white py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Вход..." : "Войти"}
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-2 ${
                    isDark
                      ? "bg-gray-800 text-gray-400"
                      : "bg-white text-gray-600"
                  }`}
                >
                  или
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  className="fill-[#6c5ce7]"
                >
                  <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                Войти с Google
              </button>
              <button
                type="button"
                onClick={handleGitHubSignIn}
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="fill-[#6c5ce7]"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Войти с GitHub
              </button>
            </div>
            <p
              className={`text-center text-sm mt-6 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Еще нет аккаунта?{" "}
              <Link
                href="/register"
                className={`font-medium ${
                  isDark
                    ? "text-[#a29bfe] hover:text-[#6c5ce7]"
                    : "text-[#6c5ce7] hover:text-[#5a4cd1]"
                } transition-colors`}
              >
                Зарегистрироваться
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
