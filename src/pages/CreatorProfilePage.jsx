import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ProfileHero } from "../components/profile/ProfileHero";
import { ProfilePlatforms } from "../components/profile/ProfilePlatforms";
import { ProfileContent } from "../components/profile/ProfileContent";
import { ProfileAudience } from "../components/profile/ProfileAudience";
import { ProfileMerch } from "../components/profile/ProfileMerch";
import { ProfileContact } from "../components/profile/ProfileContact";
import { creatorProfile } from "../data/creatorProfile";

// Only one creator exists in this prototype, so any other :username 404s -
// a real multi-tenant version would look this up server-side instead.
function NotFound({ username }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="font-display text-2xl font-semibold">Creator not found</div>
      <p className="mt-2 max-w-sm text-sm text-muted">
        There's no NOVA creator profile at "{username}".
      </p>
    </div>
  );
}

export function CreatorProfilePage() {
  const { username } = useParams();
  const location = useLocation();
  const scrollTarget = location.state?.scrollTo;

  useEffect(() => {
    if (!scrollTarget) return;
    const timer = setTimeout(() => {
      document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => clearTimeout(timer);
  }, [scrollTarget]);

  if (username !== creatorProfile.username) {
    return <NotFound username={username} />;
  }

  return (
    <>
      <ProfileHero />
      <ProfilePlatforms />
      <ProfileContent />
      <ProfileAudience />
      <ProfileMerch />
      <ProfileContact />
    </>
  );
}
