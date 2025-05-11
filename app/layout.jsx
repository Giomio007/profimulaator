import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Providers } from "./providers";
import ClientLayout from "./ClientLayout";
import { SmoothScrollProvider } from "@/Provider/SmoothScrollProvider";
import AuthProvider from "./AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "профимулятор",
  description: "Avito project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <SmoothScrollProvider>
            <AuthProvider>
              <ThemeProvider>
                <ClientLayout>{children}</ClientLayout>
              </ThemeProvider>
            </AuthProvider>
          </SmoothScrollProvider>
        </Providers>
      </body>
    </html>
  );
}
