import { toast } from "react-toastify";

export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_UNAUTHORIZED = 401;

export type Modes = 'userPref' | 'gameData';

const urls: Record<Modes | 'server', string> = {
  server: 'http://localhost:5000',
  userPref: '/api/steam/user/recentGames/',
  gameData: '/api/steam/game-data/',
};

const TOAST_ID = "error-toast";

export const callServer = async <T extends Record<string, any> | null>(mode: Modes, id: number | string): Promise<T | null> => {
  const fullUrl = `${urls.server}${urls[mode]}${id}`;
  console.log(fullUrl);
  try {
    const response = await fetch(fullUrl);
    const status = response.status;

    if (status === HTTP_STATUS_OK) {
      try {
        return await response.json() as Promise<T>;
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        toast.error("Błąd: Niepoprawny format odpowiedzi z serwera.", { toastId: TOAST_ID });
        return null;
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
    console.error("Network error:", error);
    toast.error("Błąd: Brak połączenia z serwerem.", { toastId: TOAST_ID });
  }

  return null;
};
