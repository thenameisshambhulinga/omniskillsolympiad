import OsoCleanLandingPage from "@/components/landing/clean/OsoCleanLandingPage";
import { getPublishedAnnouncementPosters } from "@/lib/announcement-posters";

export default async function Home() {
  const posters = await getPublishedAnnouncementPosters();

  return <OsoCleanLandingPage posters={posters} />;
}