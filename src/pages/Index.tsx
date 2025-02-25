
import React, { useEffect, useRef } from 'react';
import BackgroundEffects from '@/components/landing/BackgroundEffects';
import MainContentWrapper from '@/components/landing/MainContentWrapper';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import DemoSection from '@/components/landing/DemoSection';
import UseCasesSection from '@/components/landing/UseCasesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  useScrollVisibility();

  useEffect(() => {
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

      // Ensure all direct children have proper stacking
      const children = rootDiv.children;
      Array.from(children).forEach(child => {
        setElementStyles(child, {
          position: 'static',
          transition: 'none',
          height: 'auto'
        });
      });
    }

    // Ensure the main container has proper layout
    if (mainRef.current) {
      mainRef.current.style.minHeight = '100vh';
      mainRef.current.style.height = 'auto';
      mainRef.current.style.position = 'static';
      mainRef.current.style.overflow = 'visible';
    }
  }, []);

  return (
    <div 
      ref={mainRef}
      className="min-h-screen bg-aurora-black"
      style={{ 
        height: 'auto',
        overflow: 'visible',
        position: 'static'
      }}
    >
      <BackgroundEffects />
      <MainContentWrapper>
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <UseCasesSection />
        <TestimonialsSection />
        <PricingSection />
      </MainContentWrapper>
    </div>
  );
};

export default Index;
