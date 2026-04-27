import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "AI Content Marketing Dashboard",
  description: "Discover trends, generate content, and track performance in one workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${dmMono.variable}`}>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">{children}</body>
    </html>
  );
}