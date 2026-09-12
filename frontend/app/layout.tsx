import type { Metadata } from "next";
import "./globals.css";
import Providers from "./_components/Providers";
import Contents from "./_components/Layouts/Contents";

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
        <Providers>
          <Contents>{children}</Contents>
        </Providers>
      </body>
    </html>
  );
}
