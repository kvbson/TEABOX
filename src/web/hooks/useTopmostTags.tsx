import { useEffect, useState } from 'react';
import { callServer } from '../../api/webClients/callServer';

export const useTopmostTags = () => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopmostTags = async () => {
      setLoading(true);
      console.log('[TopmostTags] Fetching...');
      const { data, error } = await callServer<string[], any>('topmostTags', {});
      console.log('[TopmostTags] API response:', data);
      if (error) {
        console.log(`[TopmostTags] Failed fetching topmost tags. Error: ${error.message}`);
        setError(error);
      }
      if (data) {
        setData(data);
      }
      setLoading(false);

    };

    fetchTopmostTags();
  }, []);

  return { data, loading, error };
};