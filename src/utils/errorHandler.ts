import { toast } from "react-toastify";
export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_UNAUTHORIZED = 401;
//
// export const HTTP_STATUS_CREATED = 201;
// export const HTTP_STATUS_NO_CONTENT = 204;
// export const HTTP_STATUS_BAD_REQUEST = 400;
// export const HTTP_STATUS_FORBIDDEN = 403;
// export const HTTP_STATUS_NOT_ACCEPTABLE = 406;
// export const HTTP_STATUS_CONFLICT = 409;
// export const HTTP_STATUS_ERROR = 500;

const TOAST_ID = "error-toast";

export const errorHandler = (response: Response) => {
  const status = response.status;
  if (status === HTTP_STATUS_OK) {
    return response.json();
  }

  const errorTable: Record<number, string> = {
    [HTTP_STATUS_UNAUTHORIZED]: 'Błąd 401: Nieautoryzowany dostęp.',
    [HTTP_STATUS_NOT_FOUND]: 'Błąd 404: Nie znaleziono zasobu.',
  };
  if (!toast.isActive(TOAST_ID)) {
      toast.error(errorTable[status], { toastId: TOAST_ID });
  }
}