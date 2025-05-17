import { useEffect, useState } from 'react';
import GamesShowcase from '../components/GamesShowcase';
import LoadingOverlay from '../components/LoadingOverlay';
import { useSortedGameInfo } from '../hooks/useSortedGameInfo';
import { toast } from 'react-toastify';

interface RecommendationsProps {
  menuOpened: boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  steamId: string;
  sidebarTags: string[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ menuOpened, setError, sidebarTags }) => {
  const { data, error, loading } = useSortedGameInfo(sidebarTags);

  useEffect(() => {
    setError(error);
  }, [error, setError]);

  const [selectedGameIndex, setSelectedGameIndex] = useState(1); //changed to 1 for now, cuz theres a bugged game at beggining

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
  if (error) return toast.error(error);

  return (
    <div className="mt-10">
      {currentAppDetails && (
        <GamesShowcase
          menuOpened={menuOpened}
          appDetails={currentAppDetails}
          isLoading={loading}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default Recommendations;
