import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Layouts/Header";
import Footer from "./_components/Layouts/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chiang Mai Journey",
  description: "나의 치앙마이 여행 플래너",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <Header />
      <body className={`${inter.className} min-h-full`}>{children}</body>
      <Footer />
    </html>
  );
}
