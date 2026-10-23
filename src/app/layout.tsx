import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NMH AI Video Studio — Biến ý tưởng thành video bằng AI",
  description: "Tạo video TikTok, YouTube Shorts, Reels, giáo dục, motion graphics bằng AI. Nhập ý tưởng, AI lo phần còn lại.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
