import { useEffect } from 'react';
import { toast } from 'react-toastify';

const ToastSuccess: React.FC<{ success: string | null }> = ({ success }) => {
  useEffect(() => {
    if (success) {
      toast.success(success);
    }
  }, [success]);
  return null;
};

export default ToastSuccess;
