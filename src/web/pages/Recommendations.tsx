import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import GamesShowcase from '../components/GamesShowcase';
import LoadingOverlay from '../components/LoadingOverlay';
import { useSortedGameInfo } from '../hooks/useSortedGameInfo';
import { callServer } from '../../api/webClients/callServer';

interface RecommendationsProps {
  sidebarOpened: boolean;
  setError: React.Dispatch<React.SetStateAction<string | Error | null>>;
  steamId: string;
  sidebarTags: string[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ sidebarOpened, setError, sidebarTags }) => {
  const { data, error, loading, setLoading } = useSortedGameInfo(sidebarTags);
  const [enrichedGame, setEnrichedGame] = useState<typeof data[0] & { pros?: string[]; cons?: string[] } | null>(null);

  useEffect(() => {
    if (error) {
      setError(error);
    }
  }, [error, setError]);

  const [selectedGameIndex, setSelectedGameIndex] = useState(1); //changed to 1 for now, cuz theres a bugged game at beggining

  useEffect(() => {
    const fetchProsNCons = async () => {
      try {
        setLoading(true);
        const { data: prosNCons } = await callServer('prosNCons', {
          appId: data[selectedGameIndex].steam_appid.toString(),
        }) as any;
        const pros = Object.values(prosNCons.pros).filter((el: any) => !!el);
        const cons = Object.values(prosNCons.cons).filter((el: any) => !!el);
        if (!prosNCons || !pros || !cons) {
          return;
        }
        const fullGame = {
          ...data[selectedGameIndex],
          pros: pros.length > 0 ? pros : data[selectedGameIndex].pros,
          cons: cons.length > 0 ? cons : data[selectedGameIndex].cons,
        };
        setEnrichedGame(fullGame as any);
        setLoading(false);
      } catch {
        setEnrichedGame(null);
      }
    };

    if (data.length > 0) {
      fetchProsNCons();
    }
  }, [selectedGameIndex, data]);

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
          appDetails={enrichedGame || data[selectedGameIndex]}
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
