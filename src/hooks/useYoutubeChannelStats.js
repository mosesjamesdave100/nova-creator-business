import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getChannelStats } from "../integrations/youtube";

// The signed-in creator's YouTube numbers: live when they've connected
// YouTube, demo data otherwise (see the adapter). null while loading.
export function useYoutubeChannelStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;
    getChannelStats(user?.id).then((result) => {
      if (active) setStats(result);
    });
    return () => {
      active = false;
    };
  }, [user?.id]);

  return stats;
}
