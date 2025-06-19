import ChartWrapper from '../components/charts/ChartWrapper';
import GenreChart, { GenreChartData } from '../components/charts/GenreChart';
import PublisherChart, { PublisherChartData } from '../components/charts/PublisherChart';
import { useBigQueryData } from '../hooks/bigQuery/useBigQuery';

const StatisticsCharts = () => {
  const bestPublishers = useBigQueryData('bestPublishers', { limit: 30 });
  const bestGenres = useBigQueryData('mostRatedGenres');

  const bestPublishersData: PublisherChartData[] = (bestPublishers.data ?? []).map(
    ({ publisher, review_count, avg_score }) => ({ publisher, review_count, avg_score }),
  );

  const bestGenresData: GenreChartData[] = (bestGenres.data ?? []).map(
    ({ genre, review_count }) => ({ genre, review_count }),
  );

  return (
    <>
      <ChartWrapper>
        <PublisherChart data={bestPublishersData} />
      </ChartWrapper>

      <ChartWrapper>
        <GenreChart data={bestGenresData} />
      </ChartWrapper>
    </>
  );
};

export default StatisticsCharts;
