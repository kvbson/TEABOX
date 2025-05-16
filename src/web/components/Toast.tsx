import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const Toast: React.FC<{mode: 'error' | 'success', text: string}> = ({ mode, text }) => {
  useEffect(() => {
    if (text) {
      toast[mode](text);
    }
  }, [mode, text]);
  return <ToastContainer
    position="bottom-right"
    autoClose={3000}
    draggable
    style={{ fontSize: '10px', maxWidth: '200px', height: 'auto' }}
  />;
};

export default Toast;