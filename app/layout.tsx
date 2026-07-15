import type { Metadata } from "next";

import "./globals.css";

import ConditionalSiteFooter from "@/components/layout/ConditionalSiteFooter";
import ConditionalSiteNavbar from "@/components/layout/ConditionalSiteNavbar";
import SelectionAnnouncementTicker from "@/components/quiz/SelectionAnnouncementTicker";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: "Omni Skills Olympiad",
  description: "India's National Multidisciplinary Skills Ecosystem",
  openGraph: {
    title: "Omni Skills Olympiad",
    description: "Learn. Build. Compete. Get Ranked.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Omni Skills Olympiad",
    description: "India's National Multidisciplinary Skills Ecosystem",
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
      <body className="min-h-screen bg-[#f8f9fa] antialiased">
        <ConditionalSiteNavbar />

        <main id="main-content" tabIndex={-1} className="relative min-h-screen overflow-x-clip outline-none">
          <SelectionAnnouncementTicker />
          {children}
        </main>

        <ConditionalSiteFooter />
      </body>
    </html>
  );
}