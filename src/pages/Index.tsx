
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
    // Fix height and transition issues
    const setElementStyles = (element: Element | null, styles: Partial<CSSStyleDeclaration>) => {
      if (element && element instanceof HTMLElement) {
        Object.assign(element.style, styles);
      }
    };

    const rootDiv = document.querySelector('div#root');
    if (rootDiv) {
      setElementStyles(rootDiv.querySelector('div:nth-child(1)'), { height: 'auto', transition: 'none' });
      setElementStyles(rootDiv, { transition: 'none' });
      setElementStyles(rootDiv.querySelector('div:nth-child(2)'), { transition: 'none' });
      setElementStyles(rootDiv.querySelector('div:nth-child(3)'), { transition: 'none' });
      setElementStyles(rootDiv.querySelector('div:nth-child(4)'), { transition: 'none' });
      setElementStyles(rootDiv.querySelector('div:nth-child(5)'), { transition: 'none' });
    }

    // Ensure the root div maintains its height
    if (mainRef.current) {
      mainRef.current.style.minHeight = '100vh';
      mainRef.current.style.height = 'auto';
      mainRef.current.style.overflow = 'visible';
    }
  }, []);

  return (
    <div 
      ref={mainRef}
      className="relative min-h-screen bg-aurora-black"
      style={{ 
        height: 'auto',
        overflow: 'visible'
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
