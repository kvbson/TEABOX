import ChartWrapper from '../components/charts/ChartWrapper';
import GamesChart, { GamesChartData } from '../components/charts/GamesChart';
import GenreChart, { GenreChartData } from '../components/charts/GenreChart';
import PublisherChart, { PublisherChartData } from '../components/charts/PublisherChart';
import { useBigQueryData } from '../hooks/bigQuery/useBigQuery';

const StatisticsCharts = () => {
  const bestPublishers = useBigQueryData('bestPublishers', { limit: 30 });
  const bestGenres = useBigQueryData('mostRatedGenres');
  const bestReviewedGames = useBigQueryData('bestReviewedGames', { limit: 25 });

  const bestPublishersData: PublisherChartData[] = (bestPublishers.data ?? []).map(
    ({ publisher, review_count, avg_score }) => ({ publisher, review_count, avg_score }),
  );

  const bestGenresData: GenreChartData[] = (bestGenres.data ?? []).map(
    ({ genre, review_count, avg_score }) => ({ genre, review_count, avg_score }),
  );

  const bestReviewedGamesData: GamesChartData[] = (bestReviewedGames.data ?? []).map(
    ({ steam_appid, review_count, upvotes, positive_ratio, name: steamAppName }) => ({
      steam_appid,
      name: steamAppName,
      review_count,
      upvotes,
      positive_ratio,
    }));

  return (
    <>
      <ChartWrapper title='Best publishers based on reviews'>
        <PublisherChart data={bestPublishersData} />
      </ChartWrapper>

      <ChartWrapper title='Most rated genres'>
        <GenreChart data={bestGenresData} />
      </ChartWrapper>

      <ChartWrapper title='Best reviewed games'>
        <GamesChart data={bestReviewedGamesData} />
      </ChartWrapper>
    </>
  );
};

export default StatisticsCharts;
