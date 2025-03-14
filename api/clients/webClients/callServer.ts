import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVER_URL, API_ENDPOINTS, TOAST_ID } from './utils/config';
import { HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_NOT_FOUND } from './utils/httpsStatus';
import { ApiResponse, ModeParams } from '../../types/api';

const apiClient = axios.create({
  baseURL: SERVER_URL,
});

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
    const { data } = await apiClient.get<ApiResponse<T>>(endpoint, {
      params: params,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const message = errorMessages[status] || `Error ${status}: An unknown error occurred.`;

      if (!toast.isActive(TOAST_ID)) {
        toast.error(message, { toastId: TOAST_ID });
      }
    } else {
      console.error('Network error:', error);
      toast.error('Error. Connection to server not established.', { toastId: TOAST_ID });
    }
    return { data: null };
  }
};