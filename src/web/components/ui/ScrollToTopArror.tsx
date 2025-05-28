import { useEffect, useState } from 'react';
import { PiArrowFatUpFill } from 'react-icons/pi';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const minDepth = 300;
      setVisible(window.scrollY > minDepth);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`scroll-to-top ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
    >
      <PiArrowFatUpFill />
      <div id='scroll-to-top-text'>Go up</div>
    </div>
  );
}
