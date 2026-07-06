import type { AssociationStory } from "@/components/public-site/association-story.types";
import { associatedOrganizations } from "@/data/public-site";

type StoryProfile = Omit<
  AssociationStory,
  "id" | "shortName" | "name" | "relationship" | "description" | "featured"
>;

const profiles: Readonly<Record<string, StoryProfile>> = {
  VTU: {
    category: "Academic ecosystem",
    headline: "Anchoring practical engineering progression in a university ecosystem.",
    highlights: ["Practical learning", "Research & innovation", "Industry engagement"],
    logo: {
      src: "/vtu.png",
      alt: "Visvesvaraya Technological University logo",
      width: 1646,
      height: 698,
      heroScale: "88%",
      navigationScale: "90%",
    },
    theme: {
      accent: "#F59E0B",
      secondary: "#2F855A",
      soft: "#FFF4D8",
      glow: "rgba(245, 158, 11, 0.34)",
      ink: "#FFF9EA",
    },
    visualKind: "academic-orbit",
    visualSeed: 1,
    website: "https://vtu.ac.in/",
    ctaLabel: "Visit VTU",
  },
  BCIC: {
    category: "Industry chamber",
    headline: "Connecting education, enterprise and workforce readiness.",
    highlights: ["Industry collaboration", "Entrepreneurship", "Workforce readiness"],
    logo: {
      src: "/bcic.png",
      alt: "Bangalore Chamber of Industry and Commerce logo",
      width: 1647,
      height: 698,
      heroScale: "88%",
      navigationScale: "90%",
    },
    theme: {
      accent: "#EF3B2D",
      secondary: "#F59E0B",
      soft: "#FFE5DF",
      glow: "rgba(239, 59, 45, 0.32)",
      ink: "#FFF3F0",
    },
    visualKind: "industry-bridge",
    visualSeed: 2,
    website: "https://www.bcic.in/",
    ctaLabel: "Visit BCIC",
  },
  FKCCI: {
    category: "Industry federation",
    headline: "Extending the OSO dialogue across Karnataka's business and industry network.",
    highlights: ["Industry network", "Skill development", "Academia collaboration"],
    logo: {
      src: "/fkcci.png",
      alt: "Federation of Karnataka Chambers of Commerce and Industry logo",
      width: 1646,
      height: 698,
      heroScale: "88%",
      navigationScale: "90%",
    },
    theme: {
      accent: "#6D5BD0",
      secondary: "#EF4444",
      soft: "#EEEAFE",
      glow: "rgba(109, 91, 208, 0.34)",
      ink: "#F8F5FF",
    },
    visualKind: "federation-grid",
    visualSeed: 3,
    website: "https://www.fkcci.org/",
    ctaLabel: "Visit FKCCI",
  },
  IEEE: {
    category: "Professional engineering organization",
    headline: "Reinforcing engineering excellence, standards and lifelong technical growth.",
    highlights: ["Technical standards", "Professional development", "Research community"],
    logo: {
      src: "/ieee.png",
      alt: "IEEE logo",
      width: 1641,
      height: 698,
      heroScale: "82%",
      navigationScale: "80%",
    },
    theme: {
      accent: "#2D7FA6",
      secondary: "#38BDF8",
      soft: "#DDF5FF",
      glow: "rgba(45, 127, 166, 0.38)",
      ink: "#EEFAFF",
    },
    visualKind: "standards-signal",
    visualSeed: 4,
    website: "https://www.ieee.org/",
    ctaLabel: "Visit IEEE",
  },
  IESA: {
    category: "Electronics & semiconductor industry body",
    headline: "Strengthening the industry-facing direction of Skill-on-Circuit.",
    highlights: ["Electronics ecosystem", "Semiconductor focus", "Product engineering"],
    logo: {
      src: "/iesa.png",
      alt: "India Electronics and Semiconductor Association logo",
      width: 1642,
      height: 698,
      heroScale: "89%",
      navigationScale: "88%",
    },
    theme: {
      accent: "#38A3D1",
      secondary: "#84CC16",
      soft: "#E6F8D7",
      glow: "rgba(56, 163, 209, 0.36)",
      ink: "#F0FCFF",
    },
    visualKind: "semiconductor-core",
    visualSeed: 5,
    website: "https://www.iesaonline.org/",
    ctaLabel: "Visit IESA",
  },
  INBCC: {
    category: "International business-academia network",
    headline: "Opening pathways for India–Japan knowledge and innovation exchange.",
    highlights: ["International collaboration", "Technology exchange", "Entrepreneurship"],
    logo: {
      src: "/inbcc.png",
      alt: "Indo Nippon Business Council and Academia Collaboration logo",
      width: 1646,
      height: 700,
      heroScale: "88%",
      navigationScale: "90%",
    },
    theme: {
      accent: "#F97316",
      secondary: "#22C55E",
      soft: "#FFF0E5",
      glow: "rgba(249, 115, 22, 0.34)",
      ink: "#FFF7F0",
    },
    visualKind: "international-exchange",
    visualSeed: 6,
    website: "https://inbcc.org/",
    ctaLabel: "Visit INBCC",
  },
  NASSCOM: {
    category: "Technology industry association",
    headline: "Connecting multidisciplinary engineering capability with the digital economy.",
    highlights: ["Digital transformation", "Technology talent", "Startup ecosystem"],
    logo: {
      src: "/nasscom.png",
      alt: "NASSCOM logo",
      width: 1646,
      height: 699,
      heroScale: "80%",
      navigationScale: "78%",
    },
    theme: {
      accent: "#E33C35",
      secondary: "#8B5CF6",
      soft: "#FFE4E1",
      glow: "rgba(227, 60, 53, 0.34)",
      ink: "#FFF4F3",
    },
    visualKind: "digital-constellation",
    visualSeed: 7,
    website: "https://nasscom.in/",
    ctaLabel: "Visit NASSCOM",
  },
  SiMS: {
    category: "Founding technical partner",
    headline: "Building the practical foundation of the OSO competition ecosystem.",
    highlights: ["Competition architecture", "Practical curriculum", "Technical evaluation"],
    logo: {
      src: "/sims-logo.png",
      alt: "Silicon Microsystems logo",
      width: 853,
      height: 235,
      heroScale: "74%",
      navigationScale: "72%",
    },
    theme: {
      accent: "#2867E8",
      secondary: "#20B8D4",
      soft: "#E3EEFF",
      glow: "rgba(40, 103, 232, 0.36)",
      ink: "#F3F7FF",
    },
    visualKind: "technical-foundation",
    visualSeed: 8,
  },
};

export const associationStories: readonly AssociationStory[] =
  associatedOrganizations.map((organization) => {
    const profile = profiles[organization.shortName];

    if (!profile) {
      throw new Error(`Missing association profile for ${organization.shortName}.`);
    }

    return {
      id: organization.shortName.toLowerCase(),
      shortName: organization.shortName,
      name: organization.name,
      relationship: organization.relationship,
      description: organization.description,
      featured: organization.featured === true,
      ...profile,
    };
  });
