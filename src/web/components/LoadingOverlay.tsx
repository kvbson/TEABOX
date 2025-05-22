import React, { useEffect, useState } from 'react';
import '../css/loadingOverlay.css';

const LoadingOverlay: React.FC = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 2000); // trigger opacity transition
    return () => clearTimeout(show);
  }, []);

  return (
    <div className={`loading-overlay ${visible ? 'fade-in' : ''}`}>
      <div className="spinner" />
      <h2>Loading game data...</h2>
    </div>
  );
};

export default LoadingOverlay;