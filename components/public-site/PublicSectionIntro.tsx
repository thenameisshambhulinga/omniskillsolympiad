import introStyles from "@/components/public-site/public-section-intro.module.css";

type PublicSectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
};

export default function PublicSectionIntro({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
  className = "",
}: PublicSectionIntroProps) {
  return (
    <header
      className={`${introStyles.root} ${introStyles[align]} ${introStyles[tone]} ${className}`}
    >
      <p className={introStyles.eyebrow}>{eyebrow}</p>
      <h2 className={introStyles.title}>{title}</h2>
      <p className={introStyles.description}>{description}</p>
    </header>
  );
}
