import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const Toast: React.FC<{error: string | null}> = ({ error }) => {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return <ToastContainer
    position="bottom-right"
    autoClose={3000}
    draggable
    style={{ fontSize: '10px', maxWidth: '200px', height: 'auto' }}
  />;
};

export default Toast;