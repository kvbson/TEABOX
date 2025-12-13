import React, { useEffect, useState } from 'react';
import '../css/loadingOverlay.css';

const LoadingOverlay: React.FC<{info?: string}> = ({ info }: {info?: string}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    //TODO: Trzeba to jakoś ogarnąć, żeby wyłączało się faktycznie, kiedy isLoading = false //src\web\pages\Recommendations.tsx
    const show = setTimeout(() => setVisible(true), 5000); // trigger opacity transition
    return () => clearTimeout(show);
  }, []);

  const loadingInfo = info ?? 'game data';

  return (
    <div className={`loading-overlay ${visible ? 'fade-in' : ''}`}>
      <div className="spinner" />
      <h2>Loading {loadingInfo}...</h2>
    </div>
  );
};

export default LoadingOverlay;