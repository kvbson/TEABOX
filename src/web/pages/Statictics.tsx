import ChartWrapper from '../components/charts/ChartWrapper';
import GamesChart from '../components/charts/GamesChart';
import GenreChart from '../components/charts/GenreChart';
import PublisherChart from '../components/charts/PublisherChart';

const StatisticsCharts = () => {
  // const bestPublishers = useBigQueryData('bestPublishers', { limit: 30 });
  // const bestGenres = useBigQueryData('mostRatedGenres');
  // const bestReviewedGames = useBigQueryData('bestReviewedGames', { limit: 25 });

  // const bestPublishersData: PublisherChartData[] = (bestPublishers.data ?? []).map(
  //   ({ publisher, review_count, avg_score }) => ({ publisher, review_count, avg_score }),
  // );

  // const bestGenresData: GenreChartData[] = (bestGenres.data ?? []).map(
  //   ({ genre, review_count, avg_score }) => ({ genre, review_count, avg_score }),
  // );

  // const bestReviewedGamesData: GamesChartData[] = (bestReviewedGames.data ?? []).map(
  //   ({ steam_appid, review_count, upvotes, positive_ratio, name: steamAppName }) => ({
  //     steam_appid,
  //     name: steamAppName,
  //     review_count,
  //     upvotes,
  //     positive_ratio,
  //   }));

  return (
    <>
      <ChartWrapper title="Best publishers based on reviews">
        <PublisherChart data={[]} />
      </ChartWrapper>

      <ChartWrapper title="Most rated genres">
        <GenreChart data={[]} />
      </ChartWrapper>

      <ChartWrapper title="Best reviewed games">
        <GamesChart data={[]} />
      </ChartWrapper>
    </>
  );
};

export default StatisticsCharts;
