import { toast } from 'react-toastify';
import { ApiResponse, ModeParams } from '../types/api';
import { API_ENDPOINTS, TOAST_ID } from './utils/config';
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_UNAUTHORIZED } from './utils/httpsStatus';

const errorMessages: Record<number, string> = {
  [HTTP_STATUS_UNAUTHORIZED]: 'Error 401: Unauthorized access.',
  [HTTP_STATUS_NOT_FOUND]: 'Error 404: Resource not found.',
};

type AdditionalParams = {
  limit?: number; // default limit is 100
}

export const callServer = async <T extends Record<string, unknown> | any[], M extends keyof ModeParams>(
  mode: M,
  params: ModeParams[M] & AdditionalParams,
): Promise<ApiResponse<T> | { data: null; error: any }> => {
  try {
    const endpoint = API_ENDPOINTS[mode];
    const expressServerUrl = import.meta.env.PROD ? window.location.origin : import.meta.env.VITE_SERVER_URL;
    const url = new URL(endpoint, expressServerUrl);

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value = encodeURIComponent(JSON.stringify(value));
      }
      url.searchParams.append(key, String(value));
    });

    console.log('Web making request to: ', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const json = await response.json();
      const status = response.status;
      const message = json ? `Error ${status}: ${json.error || json}` : errorMessages[status] || `Error ${status}: An unknown error occurred.`;
      if (!toast.isActive(TOAST_ID)) {
        toast.error(message, { toastId: TOAST_ID });
      }

      return { data: null, error: json };
    }
    const data: ApiResponse<T> = await response.json();
    console.log('Web API response:', data);
    if (Array.isArray(data.data)) {
      return { ...data, data: data.data.slice(0, params.limit || 100) as T };
    }
    return data;
  } catch (error) {
    console.error('Network error:', error instanceof Error ? error.message : String(error));
    toast.error('Error. Connection to server not established.', { toastId: TOAST_ID });
    return { data: null, error };
  }
};