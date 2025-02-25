
import { useEffect } from 'react';

export const useScrollVisibility = () => {
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const sections = document.querySelectorAll('section');
        sections.forEach((section) => {
          // Remove any dynamic opacity or transform changes
          section.style.opacity = '1';
          section.style.transform = 'none';
        });
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};
