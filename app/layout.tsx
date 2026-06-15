import type { Metadata } from "next";
import { Lato } from "next/font/google";

import "./globals.css";

import CompetitionNavbar from "@/components/profile/platform/CompetitionNavbar";
import ConditionalSiteFooter from "@/components/layout/ConditionalSiteFooter";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: "Omni Skills Olympiad",
  description: "India's Engineering Skills Competition Ecosystem",
  openGraph: {
    title: "Omni Skills Olympiad",
    description: "Learn. Build. Compete. Get Ranked.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Omni Skills Olympiad",
    description: "India's Engineering Skills Competition Ecosystem",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${lato.variable} min-h-screen bg-[#f8f9fa] antialiased`}>
        <CompetitionNavbar />
        <main className="relative min-h-screen">{children}</main>
        <ConditionalSiteFooter />
      </body>
    </html>
  );
}