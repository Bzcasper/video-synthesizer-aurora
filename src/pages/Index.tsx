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
    // Ensure the root div maintains its height
    if (mainRef.current) {
      mainRef.current.style.minHeight = '100vh';
      mainRef.current.style.height = 'auto';
    }

    // Simple parallax that won't interfere with content visibility
    const handleParallax = () => {
      const parallaxElements = document.querySelectorAll('[class*="parallax"]');
      parallaxElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const speed = htmlElement.getAttribute('data-speed') || '0.1';
        const y = (window.scrollY * Number(speed));
        htmlElement.style.setProperty('--parallax-y', `${y}px`);
      });
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  return (
    <div 
      ref={mainRef}
      className="relative min-h-screen bg-aurora-black overflow-x-hidden"
      style={{ height: 'auto' }}
    >
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-aurora-purple/5 via-aurora-blue/5 to-aurora-green/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-aurora-purple/10 via-aurora-blue/10 to-aurora-green/10 opacity-30" />
      </div>
      
      {/* Main content container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavigationBar />
        
        <main className="flex-1 flex flex-col" style={{ minHeight: '100vh' }}>
          {/* Hero section */}
          <div className="relative w-full">
            <HeroSection />
          </div>
          
          {/* Other sections with explicit height and visibility */}
          <div className="relative flex flex-col w-full" style={{ minHeight: 'max-content' }}>
            <div className="w-full" style={{ minHeight: 'max-content' }}>
              <FeaturesSection />
            </div>
            <div className="w-full" style={{ minHeight: 'max-content' }}>
              <DemoSection />
            </div>
            <div className="w-full" style={{ minHeight: 'max-content' }}>
              <UseCasesSection />
            </div>
            <div className="w-full" style={{ minHeight: 'max-content' }}>
              <TestimonialsSection />
            </div>
            <div className="w-full" style={{ minHeight: 'max-content' }}>
              <PricingSection />
            </div>
          </div>
        </main>
        
        <StickyCTA />
      </div>
    </div>
  );
};

export default Index;
