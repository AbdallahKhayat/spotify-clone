import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";

const HomePage = () => {
  const {
    featuredSongs,
    madeForYouSongs,
    trendingSongs,
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isLoading,
  } = useMusicStore();
  return (
    <div>
      <Topbar />
    </div>
  );
};

export default HomePage;
