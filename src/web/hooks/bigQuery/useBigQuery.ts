import { useEffect, useState } from 'react';
import { callServer } from '../../../api/webClients/callServer';
import { BigQueryTypes } from '../../types/bigQuery.types';

export const useBigQueryData = (bigQueryType: BigQueryTypes, config?: { limit?: number }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBigQueryData = async () => {
      setLoading(true);

      const { data, error } = await callServer<string[], any>('bigQueryData', {
        bigQueryType,
        limit: config?.limit,
      });
      if (error) {
        setError(error);
      }
      if (data) {
        setData(data);
      }
      setLoading(false);

    };

    fetchBigQueryData();
  }, [bigQueryType, config?.limit]);

  return { data, loading, error };
};
