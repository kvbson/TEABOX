import { useEffect, useState } from 'react';
import { callServer } from '../../../api/webClients/callServer';

export type BigQueryTypes = 'bestPublishers' |'mostRatedGenres';

export const useBigQueryData = (bigQueryType: BigQueryTypes) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBigQueryData = async () => {
      setLoading(true);

      const { data, error } = await callServer<string[], any>('bigQueryReviews', { bigQueryType });
      if (error) {
        setError(error);
      }
      if (data) {
        setData(data);
      }
      setLoading(false);

    };

    fetchBigQueryData();
  }, [bigQueryType]);

  return { data, loading, error };
};
