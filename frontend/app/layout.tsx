import type { Metadata } from "next";
import "./globals.css";
import Header from "./_components/Layouts/Header";
import Footer from "./_components/Layouts/Footer";
import AppShell from "./_components/Layouts/AppShell";

export const metadata: Metadata = {
  title: "떠나세연",
  description: "나의 여행 플래너",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full">
        <Header />
        <AppShell>{children}</AppShell>
        <Footer />
      </body>
    </html>
  );
}
