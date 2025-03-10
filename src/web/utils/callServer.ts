import { toast } from 'react-toastify';

export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_UNAUTHORIZED = 401;

const SERVER_URL = 'http://localhost:5000';

interface ModeParams {
  recentGames: { steamId: string };
  ownedGames: { steamId: string };
  gameData: { appId: number };
  playtime: { steamId: string; appId: number };
}

interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

const urls: Record<keyof ModeParams, string> = {
  recentGames: '/api/steam/user/recentGames/',
  playtime: '/api/steam/user/playtime/',
  gameData: '/api/steam/gameData/',
  ownedGames: '/api/steam/user/ownedGames/',
};

const TOAST_ID = 'error-toast';

export const callServer = async <T extends { response: Record<string, unknown> }, M extends keyof ModeParams = keyof ModeParams>(
  mode: M,
  params: ModeParams[M],
): Promise<ApiResponse<T | null>> => {
  const fullUrl = `${SERVER_URL}${urls[mode]}${Object.keys(params)
    .map((key) => `${params[key as keyof typeof params]}`)
    .join('/')}`;

  try {
    const response = await fetch(fullUrl);
    const status = response.status;

    if (status === HTTP_STATUS_OK) {
      try {
        return await response.json() as Promise<ApiResponse<T | null>>;
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        toast.error('Błąd: Niepoprawny format odpowiedzi z serwera.', { toastId: TOAST_ID });
        return { data: null, status: 500 };
      }
    }

    const errorTable: Record<number, string> = {
      [HTTP_STATUS_UNAUTHORIZED]: 'Błąd 401: Nieautoryzowany dostęp.',
      [HTTP_STATUS_NOT_FOUND]: 'Błąd 404: Nie znaleziono zasobu.',
    };

    const errorMessage = errorTable[status] || `Błąd ${status}: Wystąpił nieznany błąd.`;

    if (!toast.isActive(TOAST_ID)) {
      toast.error(errorMessage, { toastId: TOAST_ID });
    }
  } catch (error) {
    console.error('Network error:', error);
    toast.error('Błąd: Brak połączenia z serwerem.', { toastId: TOAST_ID });
  }

  return { data: null, status: 0 };
};

