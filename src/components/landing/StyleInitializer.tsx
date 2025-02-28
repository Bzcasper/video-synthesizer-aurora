
import { useEffect, useRef } from 'react';

const StyleInitializer = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Fix any global layout issues
    document.documentElement.classList.add('h-full');
    document.body.classList.add('h-full', 'overflow-x-hidden');
    
    const rootDiv = document.getElementById('root');
    if (rootDiv) {
      rootDiv.classList.add('h-full', 'flex', 'flex-col');
    }

    // Fix any z-index issues
    const fixZIndexElements = () => {
      document.querySelectorAll('.relative, .absolute, .fixed').forEach((el: Element) => {
        if (el instanceof HTMLElement && !el.style.zIndex) {
          // Only add z-index to elements that don't already have one
          const computed = window.getComputedStyle(el);
          if (computed.position !== 'static' && !computed.zIndex) {
            el.style.zIndex = '1';
          }
        }
      });
    };

    // Fix scroll containers
    const fixScrollContainers = () => {
      document.querySelectorAll('.overflow-y-auto, .overflow-auto').forEach((el: Element) => {
        if (el instanceof HTMLElement) {
          if (el.scrollHeight > el.clientHeight && !el.style.overscrollBehavior) {
            el.style.overscrollBehavior = 'contain';
          }
        }
      });
    };

    // Run fixes
    fixZIndexElements();
    fixScrollContainers();

    // Watch for DOM changes to fix any new elements
    const observer = new MutationObserver(() => {
      fixZIndexElements();
      fixScrollContainers();
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    return () => observer.disconnect();
  }, []);

  return null;
};

export default StyleInitializer;
