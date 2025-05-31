import { useEffect, useState } from 'react';
import GamesShowcase from '../components/GamesShowcase';
import LoadingOverlay from '../components/LoadingOverlay';
import { useSortedGameInfo } from '../hooks/useSortedGameInfo';
import { toast } from 'react-toastify';

interface RecommendationsProps {
  sidebarOpened: boolean;
  setError: React.Dispatch<React.SetStateAction<string | Error | null>>;
  steamId: string;
  sidebarTags: string[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ sidebarOpened, setError, sidebarTags }) => {
  const { data, error, loading } = useSortedGameInfo(sidebarTags);

  useEffect(() => {
    if (error) {
      setError(error);
    }
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
  if (error) return toast.error(error instanceof Error ? error.message : String(error));

  return (
    <div className="mt-10">
      {currentAppDetails && (
        <GamesShowcase
          appDetails={currentAppDetails}
          isLoading={loading}
          onNext={handleNext}
          onPrev={handlePrev}
          sidebarOpened={sidebarOpened}
        />
      )}
    </div>
  );
};

export default Recommendations;
