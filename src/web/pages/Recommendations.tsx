import { useEffect, useState } from 'react';
import GamesShowcase from '../components/GamesShowcase';
import LoadingOverlay from '../components/LoadingOverlay';
import Toast from '../components/Toast';
import { useSortedGameInfo } from '../hooks/useSortedGameInfo';

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
  }, [error]);

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
  if (error) return <Toast text={error ?? 'Unkwnon error'} mode={'error'} />;

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
