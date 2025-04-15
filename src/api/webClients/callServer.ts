import { toast } from 'react-toastify';
import { ApiResponse, ModeParams } from '../types/api';
import { API_ENDPOINTS, TOAST_ID } from './utils/config';
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_UNAUTHORIZED } from './utils/httpsStatus';

const errorMessages: Record<number, string> = {
  [HTTP_STATUS_UNAUTHORIZED]: 'Error 401: Unauthorized access.',
  [HTTP_STATUS_NOT_FOUND]: 'Error 404: Resource not found.',
};

export const callServer = async <T extends Record<string, unknown>, M extends keyof ModeParams>(
  mode: M,
  params: ModeParams[M],
): Promise<ApiResponse<T> | { data: null; error: any }> => {
  try {
    const endpoint = API_ENDPOINTS[mode];
    const expressServerUrl = import.meta.env.VITE_SERVER_URL;
    const url = new URL(endpoint, expressServerUrl);

    Object.entries(params ?? {}).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

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
    return data;
  } catch (error) {
    console.error('Network error:', error);
    toast.error('Error. Connection to server not established.', { toastId: TOAST_ID });
    return { data: null, error };
  }
};