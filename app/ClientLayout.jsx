"use client";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function ClientLayout({ children }) {
  const { isDark } = useTheme();
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  return (
    <div
      className="flex flex-col min-h-screen "
      style={{ backgroundColor: isDark ? "#121212" : "#ffffff" }}
    >
      <Header page={isMainPage} />
      <main className="flex-grow">{children}</main>
      <Footer page={isMainPage} />
    </div>
  );
}
