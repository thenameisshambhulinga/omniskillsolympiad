export type EventHeroStatus =
  | "Upcoming"
  | "Live"
  | "Registration Open"
  | "Registration Closing Soon"
  | "Completed";

export type EventHeroTheme =
  | "cyan"
  | "purple"
  | "blue"
  | "emerald"
  | "amber"
  | "rose";

export type EventHeroItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  ctaLabel: string;
  ctaHref: string;
  theme: EventHeroTheme;
  status: EventHeroStatus;
  featured: boolean;
  posterImage: string;
  eventDate: string;
  highlights: string[];
};

export const eventHeroItems: EventHeroItem[] = [
  {
    id: "skillathon-season",
    title: "Silicon Skillathon",
    subtitle: "India's Premier Engineering Acceleration Ecosystem",
    description:
      "Compete through daily engineering challenges, earn Silicon Points, climb leaderboards, unlock engineering tiers, and build industry-ready technical confidence.",
    category: "Flagship Competition",
    ctaLabel: "Enter Skillathon",
    ctaHref: "/login",
    theme: "cyan",
    status: "Registration Open",
    featured: true,
    posterImage: "/events/silicon-skillathon-event.jpg",
    eventDate: "2026-06-22T09:00:00+05:30",
    highlights: [
      "Daily Challenges",
      "Silicon Points",
      "Engineering Tiers",
      "Leaderboards",
    ],
  },
  {
    id: "hackathon-arena",
    title: "Hackathon Arena",
    subtitle: "Build Fast. Solve Deep. Compete Live.",
    description:
      "A high-pressure innovation arena where students convert ideas into engineering prototypes through timed build sprints.",
    category: "Innovation Sprint",
    ctaLabel: "Explore Arena",
    ctaHref: "/competition",
    theme: "purple",
    status: "Upcoming",
    featured: false,
    posterImage: "/events/hackathon-arena.jpg",
    eventDate: "2026-07-05T10:00:00+05:30",
    highlights: ["Prototype Sprint", "Team Build", "Mentor Review", "Demo Day"],
  },
  {
    id: "embedded-sprint",
    title: "Embedded Systems Sprint",
    subtitle: "Firmware, MCUs, Sensors, Debugging",
    description:
      "A hands-on embedded engineering track focused on microcontrollers, firmware logic, debugging, and hardware interfacing.",
    category: "Embedded Track",
    ctaLabel: "View Track",
    ctaHref: "/daily-challenges",
    theme: "emerald",
    status: "Upcoming",
    featured: false,
    posterImage: "/events/embedded-systems-sprint.jpg",
    eventDate: "2026-07-18T09:30:00+05:30",
    highlights: ["MCU Logic", "Sensor Flow", "Firmware", "Debugging"],
  },
  {
    id: "vlsi-championship",
    title: "VLSI Design Championship",
    subtitle: "Logic Design Meets Semiconductor Readiness",
    description:
      "A semiconductor-focused competition pathway for digital logic, Verilog, FPGA thinking, and chip-design fundamentals.",
    category: "Semiconductor Arena",
    ctaLabel: "Join Preview",
    ctaHref: "/competition",
    theme: "blue",
    status: "Registration Open",
    featured: false,
    posterImage: "/events/vlsi-design-championship.jpg",
    eventDate: "2026-08-02T09:00:00+05:30",
    highlights: ["Digital Logic", "Verilog", "FPGA", "Chip Readiness"],
  },
  {
    id: "ai-robotics",
    title: "AI & Robotics Arena",
    subtitle: "Automation, Intelligence, Control",
    description:
      "A futuristic engineering arena combining robotics workflows, applied AI thinking, sensor intelligence, and autonomous systems.",
    category: "Autonomous Systems",
    ctaLabel: "Discover Arena",
    ctaHref: "/competition",
    theme: "rose",
    status: "Upcoming",
    featured: false,
    posterImage: "/events/ai-robotics-arena.jpg",
    eventDate: "2026-08-16T10:00:00+05:30",
    highlights: ["Robotics", "AI Logic", "Automation", "Control Systems"],
  },
  {
    id: "worldskills-prep",
    title: "WorldSkills Preparation",
    subtitle: "Precision Training For Elite Competition",
    description:
      "A structured pathway for students preparing for advanced technical competitions, skill excellence, and industry-grade execution.",
    category: "Elite Preparation",
    ctaLabel: "Start Pathway",
    ctaHref: "/worldskills",
    theme: "amber",
    status: "Upcoming",
    featured: false,
    posterImage: "/events/worldskills-preparation.jpg",
    eventDate: "2026-09-01T09:00:00+05:30",
    highlights: ["Skill Mastery", "Precision", "Practice", "Mentorship"],
  },
];

export const featuredEventHero =
  eventHeroItems.find((item) => item.featured) ?? eventHeroItems[0];
