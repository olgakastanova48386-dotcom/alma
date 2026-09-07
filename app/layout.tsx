import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import DogFriendlyMapEnhancer from "@/components/DogFriendlyMapEnhancer";
import LegalFooter from "@/components/LegalFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALMA — места Санкт-Петербурга",
  description:
    "Подбирай места Санкт-Петербурга по настроению, компании и бюджету.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <DogFriendlyMapEnhancer />
        <div className="flex-1">{children}</div>
        <LegalFooter />
      </body>
    </html>
  );
}
