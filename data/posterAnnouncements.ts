export type PosterAnnouncementBadge = "LIVE" | "NEW" | "REGISTRATION OPEN";

export type PosterAnnouncement = {
  id: string;
  image: string;
  title: string;
  ctaText: string;
  ctaLink: string;
  badge: PosterAnnouncementBadge;
};

export const posterAnnouncements: PosterAnnouncement[] = [
  {
    id: "poster-1",
    image: "/posters/poster1.jpg",
    title: "Omni Skills Olympiad Season 1",
    ctaText: "Register Now",
    ctaLink: "/login",
    badge: "REGISTRATION OPEN",
  },
  {
    id: "poster-2",
    image: "/posters/poster2.jpg",
    title: "Engineering Hackathon",
    ctaText: "Join Event",
    ctaLink: "/login",
    badge: "NEW",
  },
  {
    id: "poster-3",
    image: "/posters/poster3.jpg",
    title: "Innovation Challenge",
    ctaText: "Explore",
    ctaLink: "/login",
    badge: "LIVE",
  },
  {
    id: "poster-4",
    image: "/posters/poster4.jpg",
    title: "Internship Drive",
    ctaText: "Apply Now",
    ctaLink: "/login",
    badge: "REGISTRATION OPEN",
  },
];
