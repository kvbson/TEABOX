import { toast } from 'react-toastify';
import { ApiResponse, ModeParams } from '../types/api';
import { SERVER_URL, API_ENDPOINTS, TOAST_ID } from './utils/config';
import { HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_NOT_FOUND } from './utils/httpsStatus';

const errorMessages: Record<number, string> = {
  [HTTP_STATUS_UNAUTHORIZED]: 'Error 401: Unauthorized access.',
  [HTTP_STATUS_NOT_FOUND]: 'Error 404: Resource not found.',
};

export const callServer = async <T extends { response: Record<string, unknown> }, M extends keyof ModeParams>(
  mode: M,
  params: ModeParams[M],
): Promise<ApiResponse<T> | { data: null }> => {
  try {
    const endpoint = API_ENDPOINTS[mode];
    const url = new URL(endpoint, SERVER_URL);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const status = response.status;
      const message = errorMessages[status] || `Error ${status}: An unknown error occurred.`;

      if (!toast.isActive(TOAST_ID)) {
        toast.error(message, { toastId: TOAST_ID });
      }

      return { data: null };
    }
    const data: ApiResponse<T> = await response.json();
    return data;
  } catch (error) {
    console.error('Network error:', error);
    toast.error('Error. Connection to server not established.', { toastId: TOAST_ID });
    return { data: null };
  }
};