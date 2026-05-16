import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TOMU Admin",
    template: "%s | TOMU Admin",
  },
  description: "TOMU online ta'lim tizimi admin paneli",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ✅ data-joy-color-scheme olib tashlandi — CssVarsProvider o'zi qo'yadi
    <html lang="uz" suppressHydrationWarning>

      <body className={montserrat.variable} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
