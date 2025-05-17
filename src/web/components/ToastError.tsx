import { useEffect } from 'react';
import { toast } from 'react-toastify';

const ToastError: React.FC<{ error: string | null }> = ({ error }) => {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return null;
};

export default ToastError;
