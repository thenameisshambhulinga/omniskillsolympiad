export type OmniLink = {
  label: string;
  href: string;
};

export type OmniSkillSchool = {
  title: string;
  domains: string[];
};

export type OmniLevel = {
  code: string;
  title: string;
  scope: string;
};

export type VibgyorLevel = {
  color: string;
  role: string;
  focus: string;
};

export const omniBrand = {
  name: "OMNI Skills Olympiad",
  tagline: "Learn. Build. Compete. Innovate. Lead.",
  secondaryTagline:
    "India's Engineering Skills Competition & Career Development Ecosystem",
  heroTitle: "India's Largest Engineering Skills Competition Platform",
  closing:
    "Don't just earn a degree. Build skills, confidence, recognition and your career.",
};

export const omniGrowthLoop = [
  "Learn",
  "Practice",
  "Compete",
  "Rank",
  "Get Recognized",
  "Build Portfolio",
  "Get Internships",
  "Get Hired",
  "Become a Leader",
];

export const vibgyorLevels: VibgyorLevel[] = [
  {
    color: "Violet",
    role: "Explorer",
    focus: "Learn fundamentals",
  },
  {
    color: "Indigo",
    role: "Builder",
    focus: "Develop core skills",
  },
  {
    color: "Blue",
    role: "Practitioner",
    focus: "Apply knowledge",
  },
  {
    color: "Green",
    role: "Developer",
    focus: "Build solutions",
  },
  {
    color: "Yellow",
    role: "Integrator",
    focus: "Integrate technologies",
  },
  {
    color: "Orange",
    role: "Specialist",
    focus: "Master domains",
  },
  {
    color: "Red",
    role: "Champion",
    focus: "Innovate and lead",
  },
];

export const skillSchools: OmniSkillSchool[] = [
  {
    title: "School of Electronics",
    domains: ["Electronics", "Embedded", "PCB", "FPGA", "VLSI", "Semiconductor"],
  },
  {
    title: "School of Mechanical Engineering",
    domains: ["Mechanical", "CAD/CAM", "Manufacturing", "EV", "Aerospace"],
  },
  {
    title: "School of Electrical Engineering",
    domains: ["Power Systems", "Renewable Energy", "Smart Grid", "Industrial Drives"],
  },
  {
    title: "School of Mechatronics & Automation",
    domains: ["Instrumentation", "PLC", "SCADA", "Robotics", "Automation", "IIoT"],
  },
  {
    title: "School of Computing",
    domains: ["Computer Science", "Information Science", "IT", "Cloud", "Software Engineering"],
  },
  {
    title: "School of Artificial Intelligence",
    domains: ["AI", "Machine Learning", "Data Science", "Generative AI", "Computer Vision", "NLP"],
  },
  {
    title: "School of Cyber Security",
    domains: ["Ethical Hacking", "Digital Forensics", "Cyber Defense", "Cloud Security"],
  },
];

export const competitionEcosystem = [
  {
    title: "Daily Challenges",
    rhythm: "5-minute competitions",
    scope: "Continuous practice loop",
    href: "/daily-challenges",
  },
  {
    title: "Weekly Challenges",
    rhythm: "Domain-specific",
    scope: "Focused skill improvement",
    href: "/competition",
  },
  {
    title: "Monthly Championships",
    rhythm: "Institution rankings",
    scope: "College-level recognition",
    href: "/competition",
  },
  {
    title: "Quarterly Grand Challenges",
    rhythm: "State rankings",
    scope: "Multi-domain competitions",
    href: "/competition",
  },
  {
    title: "National Olympiad",
    rhythm: "Annual finals",
    scope: "National recognition",
    href: "/competition",
  },
];

export const omniLevels: OmniLevel[] = [
  {
    code: "OMNI-1",
    title: "Institution Level",
    scope: "College and department ranking",
  },
  {
    code: "OMNI-2",
    title: "District Level",
    scope: "District-level recognition",
  },
  {
    code: "OMNI-3",
    title: "State Level",
    scope: "State-level competition pathway",
  },
  {
    code: "OMNI-4",
    title: "National Level",
    scope: "National Olympiad readiness",
  },
  {
    code: "OMNI-5",
    title: "International Level",
    scope: "WorldSkills pathway",
  },
];

export const worldSkillsPathway = [
  "Institution",
  "District",
  "State",
  "National",
  "WorldSkills India",
  "WorldSkills International",
];

export const primaryNavigation: OmniLink[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Challenges", href: "/daily-challenges" },
  { label: "Competitions", href: "/competition" },
  { label: "Leaderboard", href: "/daily-leaderboard" },
  { label: "WorldSkills", href: "/worldskills" },
];

export const ecosystemNavigation: OmniLink[] = [
  { label: "Skill Schools", href: "/#skill-schools" },
  { label: "OMNI Levels", href: "/#omni-levels" },
  { label: "Skill Passport", href: "/profile" },
  { label: "Career Hub", href: "/#career-hub" },
  { label: "Awards", href: "/#awards" },
  { label: "Community", href: "/#community" },
];

export const portalNavigation: OmniLink[] = [
  { label: "Student Portal", href: "/dashboard" },
  { label: "Mentor Portal", href: "/#mentor-portal" },
  { label: "Industry Portal", href: "/#industry-portal" },
  { label: "Admin Portal", href: "/admin" },
];

export const footerGroups = [
  {
    title: "Platform",
    links: [
      { label: "About OMNI", href: "/" },
      { label: "Competitions", href: "/competition" },
      { label: "Skill Domains", href: "/#skill-schools" },
      { label: "WorldSkills", href: "/worldskills" },
    ],
  },
  {
    title: "Student",
    links: [
      { label: "Register", href: "/login" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Daily Challenges", href: "/daily-challenges" },
      { label: "Skill Passport", href: "/profile" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "Mentors", href: "/#mentor-portal" },
      { label: "Institutions", href: "/#institutions" },
      { label: "Industry", href: "/#industry-portal" },
      { label: "Careers", href: "/#career-hub" },
    ],
  },
  {
    title: "Recognition",
    links: [
      { label: "Leaderboards", href: "/daily-leaderboard" },
      { label: "Awards", href: "/#awards" },
      { label: "Community", href: "/#community" },
      { label: "News & Media", href: "/#news-media" },
    ],
  },
];

export const adminOperations: OmniLink[] = [
  { label: "Admin Command Center", href: "/admin" },
  { label: "Challenge Control", href: "/admin/manage-challenges" },
  { label: "Poster Publisher", href: "/admin/announcements" },
  { label: "Competition Control", href: "/admin/competition" },
];