import type { Metadata } from "next";
import Script from "next/script";
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
  const analyticsToken = process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN;

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
        {analyticsToken ? (
          <Script
            id="cloudflare-web-analytics"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            type="module"
            strategy="afterInteractive"
            data-cf-beacon={JSON.stringify({ token: analyticsToken })}
          />
        ) : null}
      </body>
    </html>
  );
}
