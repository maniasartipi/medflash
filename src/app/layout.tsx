import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: "MedFlash - Medical Flashcards",
  description: "Spaced repetition flashcards for medical students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazir.className}>
        {children}
      </body>
    </html>
  );
}
