import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "햄스문고 - 관리자 페이지",
  description: "햄스문고 관리자 페이지입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body>{children}</body>
    </html>
  );
}
