import type { Metadata } from "next";


import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";
import "./globals.css";

import ConditionalSiteFooter from "@/components/layout/ConditionalSiteFooter";
import ConditionalSiteNavbar from "@/components/layout/ConditionalSiteNavbar";
import SelectionAnnouncementTicker from "@/components/quiz/SelectionAnnouncementTicker";

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
      <body className="min-h-screen bg-[#f8f9fa] antialiased">
        <ConditionalSiteNavbar />

        <main className="relative min-h-screen overflow-x-clip">
          <SelectionAnnouncementTicker />
          {children}
        </main>

        <ConditionalSiteFooter />
      </body>
    </html>
  );
}