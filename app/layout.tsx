import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "햄스문고 - 관리자 페이지",
  description: "햄스문고 관리자 페이지입니다.",
  openGraph: {
    title: "햄스문고",
    description: "햄스문고 관리자 페이지!",
    url: "https://hams-book-admin.vercel.app/",
    images: [
      {
        url: "https://hams-book-admin.vercel.app/t2.png",
        width: 1200,
        height: 630,
        alt: "햄스문고 관리자 썸네일",
      },
    ],
    type: "website",
  },
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
