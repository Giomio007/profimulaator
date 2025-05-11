"use client";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/register/register";

const RegisterPage = () => {
  const { isDark } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [autoSigningIn, setAutoSigningIn] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Используем refs для паролей вместо state
  const passwordRef = useRef(null);
  const repeatPasswordRef = useRef(null);

  // Отключаем автоматическое сохранение паролей браузером
  useEffect(() => {
    // Явно указываем браузеру не сохранять пароли
    const form = document.getElementById("register-form");
    if (form) {
      form.setAttribute("autocomplete", "off");
      form.setAttribute("data-lpignore", "true");
    }

    // Возвращаем фокус полю ввода имени при загрузке страницы
    const nameInput = document.querySelector('input[name="name"]');
    if (nameInput) {
      nameInput.focus();
    }

    // Очищаем поля паролей при монтировании компонента
    if (passwordRef.current) passwordRef.current.value = "";
    if (repeatPasswordRef.current) repeatPasswordRef.current.value = "";
  }, []);

  useEffect(() => {
    // Перенаправление на главную страницу после показа сообщения об успешной регистрации
    if (successMessage && !autoSigningIn) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, router, autoSigningIn]);

  const getFormValues = () => {
    // Получаем значения паролей напрямую из полей ввода
    const password = passwordRef.current ? passwordRef.current.value : "";
    const repeatPassword = repeatPasswordRef.current
      ? repeatPasswordRef.current.value
      : "";

    return {
      name,
      email,
      password,
      repeatPassword,
    };
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    // Очищаем поля паролей
    if (passwordRef.current) passwordRef.current.value = "";
    if (repeatPasswordRef.current) repeatPasswordRef.current.value = "";
  };

  const autoSignIn = async (userEmail, userPassword) => {
    try {
      setAutoSigningIn(true);
      setSuccessMessage(
        "Регистрация успешна! Выполняется автоматический вход..."
      );

      const result = await signIn("credentials", {
        email: userEmail,
        password: userPassword,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.ok) {
        setSuccessMessage(
          "Вход выполнен успешно! Перенаправляем в личный кабинет..."
        );
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setSuccessMessage(
          "Регистрация успешна, но не удалось выполнить автоматический вход. Перенаправляем на главную страницу..."
        );
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Ошибка при автоматическом входе:", error);
      setSuccessMessage(
        "Регистрация успешна, но произошла ошибка при автоматическом входе."
      );
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    // Получаем актуальные значения полей
    const formValues = getFormValues();

    // Проверяем, заполнены ли все поля
    if (
      !formValues.name ||
      !formValues.email ||
      !formValues.password ||
      !formValues.repeatPassword
    ) {
      return setError("Пожалуйста, заполните все поля");
    }

    // Проверяем, совпадают ли пароли
    if (formValues.password !== formValues.repeatPassword) {
      return setError("Пароли не совпадают");
    }

    try {
      setIsLoading(true);
      setError(null);

      // Создаём данные для отправки на сервер
      const data = {
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        confirmPassword: formValues.repeatPassword,
      };

      // Сохраняем пароль во временной переменной для автовхода
      const tempPassword = formValues.password;
      const userEmail = formValues.email;

      // Вызываем серверный экшен
      const result = await registerUser(data);

      if (result.error) {
        setError(result.error);
      } else {
        // Очищаем форму после успешной регистрации
        clearForm();

        // Показываем сообщение об успешной регистрации
        setSuccessMessage("Регистрация успешно завершена!");

        // Выполняем автоматический вход с сохраненными данными
        await autoSignIn(userEmail, tempPassword);
      }
    } catch (error) {
      setError("Произошла ошибка при регистрации");
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
              Создание аккаунта
            </h2>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Зарегистрируйтесь, чтобы начать пользоваться симулятором
            </p>
          </div>

          {successMessage ? (
            <div className="text-center">
              <div className="mb-4 p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                {successMessage}
              </div>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6c5ce7]"></div>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {autoSigningIn
                  ? "Выполняется вход и перенаправление в личный кабинет..."
                  : "Перенаправление на главную страницу..."}
              </p>
              <Link
                href={autoSigningIn ? "/dashboard" : "/"}
                className={`mt-4 inline-block font-medium ${
                  isDark
                    ? "text-[#a29bfe] hover:text-[#6c5ce7]"
                    : "text-[#6c5ce7] hover:text-[#5a4cd1]"
                } transition-colors`}
              >
                Нажмите здесь, если перенаправление не происходит
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              noValidate
              id="register-form"
              autoComplete="new-password"
              method="post"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-lpignore="true"
            >
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Полное имя
                </label>
                <input
                  type="text"
                  name="name"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 focus:ring-[#a29bfe] text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 focus:ring-[#6c5ce7] text-gray-800 placeholder-gray-500"
                  }`}
                  placeholder="Введите ваше полное имя"
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  autoComplete="off"
                />
              </div>
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
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  autoComplete="off"
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
                    name="pass"
                    ref={passwordRef}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-[#a29bfe] text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 focus:ring-[#6c5ce7] text-gray-800 placeholder-gray-500"
                    } ${error ? "border-red-500" : ""}`}
                    placeholder="Введите ваш пароль"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    autoComplete="new-password"
                    data-lpignore="true"
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
              <p className="text-[14px] text-[#747474]">Введите пароль</p>
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
                    type={showRepeatPassword ? "text" : "password"}
                    name="confirmPass"
                    ref={repeatPasswordRef}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-[#a29bfe] text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 focus:ring-[#6c5ce7] text-gray-800 placeholder-gray-500"
                    } ${error ? "border-red-500" : ""}`}
                    placeholder="Повторите ваш пароль"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    autoComplete="new-password"
                    data-lpignore="true"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className={`absolute duration-150 right-3 top-2 p-2 ${
                      isDark ? "hover:bg-[#35353692]" : "hover:bg-gray-100"
                    } rounded-full`}
                    aria-label={
                      showRepeatPassword ? "Скрыть пароль" : "Показать пароль"
                    }
                  >
                    {showRepeatPassword ? (
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
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
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
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Войти с GitHub
                </button>
              </div>
              <p
                className={`text-center text-sm mt-6 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Уже есть аккаунт?{" "}
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

export default RegisterPage;
