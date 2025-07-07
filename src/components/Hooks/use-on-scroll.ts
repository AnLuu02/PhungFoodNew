import { useEffect, useState } from 'react';

export default function useScrollPosition(point: number) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setScrollY(currentY < point ? currentY : point);
          ticking = false;
        });
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [point]);

  return scrollY;
}
