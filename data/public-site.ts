export type PublicNavigationItem = {
  label: string;
  href: `#${string}`;
};

export type OmniFrameworkStage = {
  code: "O" | "M" | "N" | "I";
  title: string;
  description: string;
};

export type EcosystemNode = {
  title: string;
  shortLabel: string;
  description: string;
  evidence: string;
};

export type JourneyStage = {
  title: string;
  eyebrow: string;
  description: string;
  outcome: string;
};

export type AudienceGroup = {
  id: "students" | "institutions" | "mentors" | "industry";
  label: string;
  headline: string;
  description: string;
  benefits: readonly string[];
};

export type AssociatedOrganization = {
  shortName: string;
  name: string;
  relationship: string;
  description: string;
  featured?: boolean;
};

export const publicNavigation: readonly PublicNavigationItem[] = [
  { label: "Home", href: "#home" },
  { label: "About OSO", href: "#about" },
  { label: "Why OSO", href: "#why-oso" },
  { label: "Journey", href: "#journey" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Associations", href: "#associations" },
  { label: "Contact", href: "#contact" },
] as const;

export const heroContent = {
  eyebrow: "Beyond classrooms",
  title: {
    prefix: "The Playground of",
    accent: "Future Innovators",
  },
  description:
    "Practice every day. Prove your skills. Compete with purpose. Build a visible engineering journey through continuous learning, protected assessment, meaningful competition, and recognition.",
  publicNote:
    "Explore the public ecosystem freely. Enter the existing OSO platform only when you are ready to participate.",
  primaryCta: {
    label: "Explore the ecosystem",
    href: "#ecosystem" as const,
  },
  platformCta: {
    label: "Enter OSO platform",
    href: "/login" as const,
  },
} as const;

export const omniFramework: readonly OmniFrameworkStage[] = [
  {
    code: "O",
    title: "Observe & Learn",
    description:
      "Build engineering awareness, understand systems, and strengthen fundamentals.",
  },
  {
    code: "M",
    title: "Make & Build",
    description:
      "Convert concepts into circuits, programs, assemblies, and working prototypes.",
  },
  {
    code: "N",
    title: "Navigate Innovation",
    description:
      "Integrate technologies, troubleshoot systems, and solve multidisciplinary problems.",
  },
  {
    code: "I",
    title: "Invent",
    description:
      "Develop industry-oriented products, research prototypes, and innovative applications.",
  },
] as const;

export const identityContent = {
  eyebrow: "Who we are",
  title: "One parent ecosystem for many engineering disciplines.",
  introduction:
    "OMNI Skills Olympiad is a national engineering ecosystem built around practical capability, technical excellence, and innovation across disciplines.",
  supporting:
    "It is a long-term progression pathway—not a standalone exam—uniting discipline-specific programmes under one shared competency model.",
  vision:
    "To build a trusted ecosystem where participants develop practical competencies aligned with industry and future technologies.",
  mission:
    "To turn academic knowledge into practical progress through challenges, evaluation, problem-solving, and continuous advancement.",
  motto: "Infinite Opportunities",
} as const;

export const whyContent = {
  eyebrow: "Why OSO exists",
  title: "Engineering readiness cannot be measured by memorisation alone.",
  description:
    "Modern engineering demands practical judgement, problem-solving, and delivery. OSO helps participants practise, prove, and strengthen those capabilities over time.",
  from: {
    label: "Fragmented learning",
    points: [
      "Theory without enough implementation evidence",
      "Limited opportunities to benchmark practical competence",
      "Isolated events with little continuity after completion",
    ],
  },
  to: {
    label: "Connected progression",
    points: [
      "Continuous practice and protected assessment",
      "Stage-based competition and competency evaluation",
      "Visible progression, ranking, recognition, and skill identity",
    ],
  },
} as const;

export const ecosystemNodes: readonly EcosystemNode[] = [
  {
    title: "Profile & OMNI identity",
    shortLabel: "Identity",
    description:
      "Participants complete onboarding and build a persistent engineering profile anchored by their OMNI ID.",
    evidence: "Existing onboarding, profile, OMNI ID, and student dashboard flows.",
  },
  {
    title: "Daily practice",
    shortLabel: "Practice",
    description:
      "Short engineering challenges encourage consistency, technical recall, and continuous participation.",
    evidence: "Existing Daily Challenge engine, attempts, results, streaks, and leaderboards.",
  },
  {
    title: "Protected assessments",
    shortLabel: "Assess",
    description:
      "Published tests measure performance through controlled, one-attempt assessment experiences.",
    evidence: "Existing admin publishing, protected attempts, scoring, and selection results.",
  },
  {
    title: "Competition pathways",
    shortLabel: "Compete",
    description:
      "Participants progress into domain-specific and stage-based competition experiences governed by OSO.",
    evidence: "Existing competition dashboard, control surfaces, history, and progression concepts.",
  },
  {
    title: "Evaluation & ranking",
    shortLabel: "Benchmark",
    description:
      "Performance is translated into results, rankings, qualification status, and progressive benchmarks.",
    evidence: "Existing scoring, leaderboards, selection engine, and competition statistics.",
  },
  {
    title: "Skill identity & recognition",
    shortLabel: "Recognise",
    description:
      "Profiles, achievements, progression, certificates, and future opportunities form a long-term record of growth.",
    evidence: "Existing profile, skills, achievements, results, and recognition architecture.",
  },
] as const;

export const programmeArchitecture = {
  eyebrow: "Programme architecture",
  title: "OSO is the parent. Each discipline advances through its own programme.",
  description:
    "Every engineering discipline can operate through a dedicated Skill-on programme while sharing the OMNI philosophy, common governance, competency standards, and progression framework.",
  flagship: {
    label: "Current flagship programme",
    title: "Skill-on-Circuit",
    description:
      "The electronics and embedded-systems programme for ECE and allied circuit branches, covering practical electronics, PCB engineering, embedded systems, IoT, automation, robotics, and product engineering.",
  },
  future: {
    label: "Multidisciplinary expansion",
    title: "Discipline-specific Skill-on programmes",
    description:
      "Additional programmes can extend the OSO model to other engineering disciplines without changing the common philosophy of learning, building, evaluation, competition, and progression.",
  },
} as const;

export const journeyStages: readonly JourneyStage[] = [
  {
    eyebrow: "Discover",
    title: "Understand the OSO ecosystem",
    description:
      "Explore the public institutional website, programme philosophy, competition model, and participation pathway.",
    outcome: "A clear understanding before registration.",
  },
  {
    eyebrow: "Join",
    title: "Enter through the existing platform",
    description:
      "Use the established Google authentication flow at /login. No parallel or duplicate registration system is introduced.",
    outcome: "Secure entry into the authenticated OSO application.",
  },
  {
    eyebrow: "Build identity",
    title: "Complete onboarding and receive an OMNI ID",
    description:
      "Create the academic and engineering profile that supports participation, progression, and recognition.",
    outcome: "A persistent participant identity inside the ecosystem.",
  },
  {
    eyebrow: "Practise",
    title: "Develop consistency through daily challenges",
    description:
      "Engage with recurring technical missions, results, streaks, and leaderboard feedback.",
    outcome: "Continuous skill engagement instead of one-time preparation.",
  },
  {
    eyebrow: "Assess",
    title: "Attempt protected tests",
    description:
      "Complete published one-attempt assessments under the platform’s existing attempt and security rules.",
    outcome: "Verified performance evidence for qualification decisions.",
  },
  {
    eyebrow: "Compete",
    title: "Advance into programme stages",
    description:
      "Participate in domain-specific competitions and practical engineering challenges governed by OSO.",
    outcome: "Hands-on exposure and stage-based progression.",
  },
  {
    eyebrow: "Evaluate",
    title: "Receive results, ranking, and selection status",
    description:
      "Performance is reviewed through scoring, evaluation criteria, leaderboards, and qualification rules.",
    outcome: "Transparent progress and benchmarked capability.",
  },
  {
    eyebrow: "Recognise",
    title: "Build a visible engineering skill identity",
    description:
      "Achievements, progression, portfolios, certificates, mentorship, and future opportunities form the long-term outcome.",
    outcome: "Recognition that grows with continued participation.",
  },
] as const;

export const audienceGroups: readonly AudienceGroup[] = [
  {
    id: "students",
    label: "Students",
    headline: "Turn engineering concepts into visible capability.",
    description:
      "OSO gives participants a structured environment to practise, compete, benchmark progress, and build confidence through practical engineering experiences.",
    benefits: [
      "Practical skill development and technical confidence",
      "Progressive challenges, assessments, and competitions",
      "Portfolio, recognition, certification, and networking opportunities",
      "Exposure to mentors, technical experts, and industry-oriented workflows",
    ],
  },
  {
    id: "institutions",
    label: "Institutions",
    headline: "Strengthen the culture around practical engineering.",
    description:
      "Institutions can use the ecosystem to encourage experimentation, identify talent, improve technical exposure, and deepen industry interaction.",
    benefits: [
      "Innovation culture and student participation",
      "Practical exposure to emerging technologies",
      "Talent identification and institutional recognition",
      "Support for technical clubs, communities, and engineering activities",
    ],
  },
  {
    id: "mentors",
    label: "Faculty & mentors",
    headline: "Guide learners from curiosity to engineering discipline.",
    description:
      "Faculty mentors help participants interpret challenges, develop professional habits, collaborate effectively, and sustain research-oriented thinking.",
    benefits: [
      "Structured mentoring around practical challenges",
      "Opportunities to encourage teamwork and professional conduct",
      "Support for projects, experimentation, and technical communities",
      "Recognition of meaningful mentor contribution",
    ],
  },
  {
    id: "industry",
    label: "Industry",
    headline: "Engage with developing talent earlier and more meaningfully.",
    description:
      "Industry participation strengthens technical relevance, practical evaluation, talent visibility, mentorship, and innovation-oriented collaboration.",
    benefits: [
      "Early talent identification",
      "Industry–academia collaboration",
      "Technical guidance, evaluation, and mentorship",
      "Recruitment, innovation, and product-development pathways",
    ],
  },
] as const;

export const associatedOrganizations: readonly AssociatedOrganization[] = [
  {
    shortName: "VTU",
    name: "Visvesvaraya Technological University",
    relationship: "Associated organization",
    description:
      "Contributes through an academic ecosystem that supports practical learning, technical competency, research, innovation, and industry engagement.",
  },
  {
    shortName: "BCIC",
    name: "Bangalore Chamber of Industry and Commerce",
    relationship: "Associated organization",
    description:
      "Supports collaboration between businesses, educational institutions, and policymakers around innovation, entrepreneurship, industrial development, and workforce readiness.",
  },
  {
    shortName: "FKCCI",
    name: "Federation of Karnataka Chambers of Commerce and Industry",
    relationship: "Associated organization",
    description:
      "Represents a broad industry network and supports competitiveness, entrepreneurship, skill development, and industry–academia collaboration.",
  },
  {
    shortName: "IEEE",
    name: "IEEE",
    relationship: "Associated organization",
    description:
      "Promotes engineering excellence through technical standards, professional development, research, conferences, and educational initiatives.",
  },
  {
    shortName: "IESA",
    name: "India Electronics and Semiconductor Association",
    relationship: "Associated organization",
    description:
      "Strengthens the industry-oriented focus of Skill-on-Circuit through the electronics, semiconductor, embedded-systems, and product-engineering ecosystem.",
  },
  {
    shortName: "INBCC",
    name: "Indo Nippon Business Council & Academia Collaboration",
    relationship: "Associated organization",
    description:
      "Promotes industry, academia, and international collaboration around innovation, entrepreneurship, research, technology transfer, and workforce development.",
  },
  {
    shortName: "NASSCOM",
    name: "NASSCOM",
    relationship: "Associated organization",
    description:
      "Highlights multidisciplinary engineering capability through the technology, software, digital transformation, startup, and talent-development ecosystem.",
  },
  {
    shortName: "SiMS",
    name: "Silicon Microsystems",
    relationship:
      "Founding Technical Partner of OSO · Knowledge Partner for Skill-on-Circuit",
    description:
      "Contributes competition architecture, electronics curriculum development, practical challenges, laboratory standards, faculty development, mentoring, technical evaluation, and industry-oriented learning initiatives.",
    featured: true,
  },
] as const;

export const contactInformation = {
  organization: "OMNI Skills Olympiad",
  poweredBy: "Powered by Silicon Microsystems",
  phoneDisplay: "+91 81237 19555",
  phoneHref: "tel:+918123719555",
  email: "omniskillsolympiad@gmail.com",
  emailHref: "mailto:omniskillsolympiad@gmail.com",
  websiteDisplay: "www.omniskillsolympiad.net",
  websiteHref: "https://www.omniskillsolympiad.net",
  addressLines: [
    "VTU Regional Centre, 1st Main Road, RHCS Layout",
    "Annapoorneshwari Nagar, Nagarbhavi, Bengaluru – 560091",
    "Karnataka, India",
  ],
} as const;
