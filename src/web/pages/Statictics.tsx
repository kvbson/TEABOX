import ChartWrapper from '../components/charts/ChartWrapper';
import GamesChart from '../components/charts/GamesChart';
import GenreChart from '../components/charts/GenreChart';
import PublisherChart from '../components/charts/PublisherChart';
import LoadingOverlay from '../components/LoadingOverlay';
import { useStatistics } from '../hooks/useStatictics';

const StatisticsCharts = () => {

  const { data: bestPublishers, loading: bestPublishersLoading } = useStatistics('bestPublishers');
  const { data: mostRatedGenres, loading: mostRatedGenresLoading } = useStatistics('mostRatedGenres');
  const { data: bestReviewedGames, loading: bestReviewedGamesLoading } = useStatistics('bestReviewedGames');

  if (bestPublishersLoading || mostRatedGenresLoading || bestReviewedGamesLoading) {
    return <LoadingOverlay info="statistics" />;
  }

  return (
    <>
      <ChartWrapper title="Best publishers based on reviews">
        <PublisherChart data={bestPublishers} />
      </ChartWrapper>

      <ChartWrapper title="Most rated genres">
        <GenreChart data={mostRatedGenres} />
      </ChartWrapper>

      <ChartWrapper title="Best reviewed games">
        <GamesChart data={bestReviewedGames} />
      </ChartWrapper>
    </>
  );
};

export default StatisticsCharts;
