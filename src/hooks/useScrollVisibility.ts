
import { useEffect } from 'react';

export const useScrollVisibility = () => {
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const sections = document.querySelectorAll('section');
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (isVisible) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
          }
        });
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};
