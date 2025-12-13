import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import GamesShowcase from '../components/GamesShowcase';
import LoadingOverlay from '../components/LoadingOverlay';
import { useSortedGameInfo } from '../hooks/useSortedGameInfo';

interface RecommendationsProps {
  currentUserId: number;
  sidebarOpened: boolean;
  setError: React.Dispatch<React.SetStateAction<string | Error | null>>;
  steamId: string;
  sidebarTags: string[];
  handleBanGame: ({ currentUserId, steamapp_id }: {
    currentUserId: number;
    steamapp_id: number;
}) => Promise<void>
}

const Recommendations: React.FC<RecommendationsProps> = ({ currentUserId, sidebarOpened, setError, sidebarTags, handleBanGame }) => {
  const { data, error, loading } = useSortedGameInfo(sidebarTags, currentUserId);

  useEffect(() => {
    if (error) {
      setError(error);
    }
  }, [error, setError]);

  const [selectedGameIndex, setSelectedGameIndex] = useState(0);

  const handleNext = () => {
    setSelectedGameIndex((prev) => (prev + 1) % data.length);
  };

  const handlePrev = () => {
    setSelectedGameIndex((prev) =>
      prev === 0 ? data.length - 1 : prev - 1,
    );
  };

  const currentAppDetails = data[selectedGameIndex];

  if (loading || data.length === 0) return <LoadingOverlay />;
  if (error) return toast.error(error instanceof Error ? error.message : String(error));

  return (
    <div className="mt-10">
      {currentAppDetails && (
        <GamesShowcase
          currentUserId={currentUserId}
          appDetails={currentAppDetails}
          isLoading={loading}
          onNext={handleNext}
          onPrev={handlePrev}
          sidebarOpened={sidebarOpened}
          handleBanGame={handleBanGame}
        />
      )}
    </div>
  );
};

export default Recommendations;
