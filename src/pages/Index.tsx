
import React, { useEffect, useRef } from 'react';
import NavigationBar from '@/components/landing/NavigationBar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import DemoSection from '@/components/landing/DemoSection';
import UseCasesSection from '@/components/landing/UseCasesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import StickyCTA from '@/components/landing/StickyCTA';

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);

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

    // Simplified parallax that won't interfere with content visibility
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

  return (
    <div 
      ref={mainRef}
      className="relative min-h-screen bg-aurora-black"
      style={{ 
        height: 'auto',
        overflow: 'visible'
      }}
    >
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-aurora-purple/5 via-aurora-blue/5 to-aurora-green/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-aurora-purple/10 via-aurora-blue/10 to-aurora-green/10 opacity-30" />
      </div>
      
      {/* Main content container */}
      <div className="relative z-10">
        <NavigationBar />
        
        <main className="relative">
          <HeroSection />
          <FeaturesSection />
          <DemoSection />
          <UseCasesSection />
          <TestimonialsSection />
          <PricingSection />
        </main>
        
        <StickyCTA />
      </div>
    </div>
  );
};

export default Index;
