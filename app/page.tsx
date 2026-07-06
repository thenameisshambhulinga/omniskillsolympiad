import type { Metadata } from "next";

import PublicHomePage from "@/components/public-site/PublicHomePage";
import { contactInformation } from "@/data/public-site";

export const metadata: Metadata = {
  title: "OMNI Skills Olympiad | Practical Engineering Skill Ecosystem",
  description:
    "Explore OMNI Skills Olympiad, a multidisciplinary engineering skill ecosystem for practical learning, assessment, competition, progression, innovation, and recognition.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "OMNI Skills Olympiad",
    description:
      "A multidisciplinary engineering skill ecosystem connecting practical learning, assessment, competition, progression, and recognition.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OMNI Skills Olympiad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OMNI Skills Olympiad",
    description:
      "Explore the public OSO ecosystem and enter the existing competition platform when you are ready to participate.",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  const publicUrl = (
    process.env.NEXT_PUBLIC_APP_URL || contactInformation.websiteHref
  ).replace(/\/$/, "");

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: contactInformation.organization,
    url: publicUrl,
    email: contactInformation.email,
    telephone: "+918123719555",
    description:
      "A multidisciplinary engineering skill ecosystem for practical learning, competency development, competition, evaluation, innovation, and recognition.",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "VTU Regional Centre, 1st Main Road, RHCS Layout, Annapoorneshwari Nagar, Nagarbhavi",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560091",
      addressCountry: "IN",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <PublicHomePage />
    </>
  );
}
