"use client";
import { useTheme } from "@/context/ThemeContext";

const Footer = ({ page }) => {
  const { isDark } = useTheme();

  return (
    <footer
      className="pt-[64px] pb-[32px]"
      style={{
        backgroundColor: isDark ? "#1e1e1e" : "#1e1e1e",
        color: "white",
      }}
    >
      <div className="container max-w-[1200px] w-[90%] mx-auto px-[15px]">
        <div className="flex flex-wrap justify-between mb-[64px] gap-[32px]">
          {/* Логотип */}
          <div className="flex items-center">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-white"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"></path>
              <path d="M9.5 13.5L7 17"></path>
              <path d="M14.5 13.5L17 17"></path>
              <path d="M12 12v4"></path>
              <path d="M10 7.5l2-2.5 2 2.5"></path>
            </svg>
            <h2 className="text-[1.5rem] ml-[8px] font-bold">Профимулятор</h2>
          </div>

          {/* Ссылки */}
          <div className="flex flex-wrap gap-[32px]">
            {page && (
              <div className="min-w-[200px]">
                <h3 className="text-[1.2rem] mb-[16px]">Быстрые ссылки</h3>
                <ul className="space-y-[8px]">
                  <li>
                    <a
                      href="#home"
                      className="text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
                    >
                      Главная
                    </a>
                  </li>
                  <li>
                    <a
                      href="#simulator"
                      className="text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
                    >
                      Симулятор
                    </a>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
                    >
                      Функции
                    </a>
                  </li>
                  <li>
                    <a
                      href="#services"
                      className="text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
                    >
                      Услуги
                    </a>
                  </li>
                </ul>
              </div>
            )}

            {/* Дополнительные разделы можно добавить здесь */}
          </div>
        </div>

        <div className="pt-[16px] border-t border-white border-opacity-10 flex justify-between items-center flex-wrap gap-[16px]">
          <div className="text-white opacity-70">
            © {new Date().getFullYear()} Профимулятор. Все права защищены.
          </div>{" "}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
