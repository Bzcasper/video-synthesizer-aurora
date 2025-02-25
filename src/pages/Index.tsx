import React from 'react';
import NavigationBar from '@/components/landing/NavigationBar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import DemoSection from '@/components/landing/DemoSection';
import UseCasesSection from '@/components/landing/UseCasesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import StickyCTA from '@/components/landing/StickyCTA';

const Index = () => {
  React.useEffect(() => {
    const handleParallax = () => {
      const parallaxElements = document.querySelectorAll('[class*="parallax"]');
      parallaxElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const speed = htmlElement.getAttribute('data-speed') || '0.1';
        const y = (window.scrollY * Number(speed));
        htmlElement.style.setProperty('--parallax-y', `${y}px`);
      });
    };

    window.addEventListener('scroll', handleParallax);
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  return (
    <div className="relative min-h-screen bg-aurora-black overflow-x-hidden">
      {/* Background gradients with lower z-index */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-aurora-purple/5 via-aurora-blue/5 to-aurora-green/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-aurora-purple/10 via-aurora-blue/10 to-aurora-green/10 opacity-30" />
      </div>
      
      {/* Main content container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavigationBar />
        
        <main className="flex-1 flex flex-col">
          {/* Hero section at the top */}
          <div className="relative">
            <HeroSection />
          </div>
          
          {/* Other sections */}
          <div className="relative flex flex-col">
            <FeaturesSection />
            <DemoSection />
            <UseCasesSection />
            <TestimonialsSection />
            <PricingSection />
          </div>
        </main>
        
        <StickyCTA />
      </div>
    </div>
  );
};

export default Index;
