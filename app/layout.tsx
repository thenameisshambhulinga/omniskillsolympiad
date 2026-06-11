import type { Metadata } from "next";

import { Geist, Geist_Mono, Inter, Manrope } from "next/font/google";

import "./globals.css";

import CompetitionNavbar from "@/components/profile/platform/CompetitionNavbar";
import CompetitionBackground from "@/components/profile/platform/CompetitionBackground";
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Omni Skills Olympiad",
  description: "Advanced Engineering Competition Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`
          ${manrope.variable}
          ${inter.variable}
          ${geistSans.variable}
          ${geistMono.variable}
          bg-black
          text-white
          antialiased
        `}
      >
        <CompetitionBackground />

        <CompetitionNavbar />

        <main className="relative z-10 pt-32">{children}</main>
      </body>
    </html>
  );
}
