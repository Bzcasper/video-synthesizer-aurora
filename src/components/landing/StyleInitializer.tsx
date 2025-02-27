
import { useEffect, useRef } from 'react';

const StyleInitializer = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Use requestAnimationFrame to defer non-critical work
    requestAnimationFrame(() => {
      const setElementStyles = (element: Element | null, styles: Partial<CSSStyleDeclaration>) => {
        if (element && element instanceof HTMLElement) {
          Object.assign(element.style, styles);
        }
      };

      const rootDiv = document.querySelector('div#root');
      if (rootDiv) {
        setElementStyles(rootDiv, { 
          height: 'auto',
          minHeight: '100vh',
          transition: 'none',
          position: 'static'
        });

        const children = rootDiv.children;
        Array.from(children).forEach(child => {
          setElementStyles(child, {
            position: 'static',
            transition: 'none',
            height: 'auto'
          });
        });
      }
    });
  }, []);

  return null;
};

export default StyleInitializer;
