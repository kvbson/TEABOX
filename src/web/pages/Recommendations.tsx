import { useEffect, useState } from "react";
import useRecentGames from "../hooks/useRecentGames";
import useProfileData from "../hooks/useProfileData";
import GamesShowcase from "../components/GamesShowcase";
import LoadingOverlay from "../components/LoadingOverlay";
import Toast from "../components/Toast";

import { Dispatch, SetStateAction } from "react";

interface RecommendationsProps {
  menuOpened: boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  steamId: string;
}

const Recommendations: React.FC<RecommendationsProps> = ({ menuOpened, setError, steamId }) => {
  const { recentGames, loading, error } = useRecentGames(steamId);
  const { profileData } = useProfileData(steamId);

  useEffect(() => {
    setError(error); 
  }, [error]);

  const [gameIds, setGameIds] = useState<number[]>([]);
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);

  useEffect(() => {
    if (recentGames.length > 0) {
      const ids = recentGames.map((game) => game.appid);
      setGameIds(ids);
      setSelectedGameIndex(0);
    }
  }, [recentGames]);

  const handleNext = () => {
    setSelectedGameIndex((prev) => (prev + 1) % gameIds.length);
  };

  const handlePrev = () => {
    setSelectedGameIndex((prev) =>
      prev === 0 ? gameIds.length - 1 : prev - 1
    );
  };

  const currentAppId = gameIds[selectedGameIndex];

  if (loading && gameIds.length === 0) return <LoadingOverlay />;
  if (error) return <Toast error={error} />;

  return (
    <div className="mt-10">
      {currentAppId && (
        <GamesShowcase
          menuOpened={menuOpened}
          appId={currentAppId}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default Recommendations;
