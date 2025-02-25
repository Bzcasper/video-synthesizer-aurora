
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
    <div className="min-h-screen bg-aurora-black">
      {/* Fixed background gradients */}
      <div className="fixed inset-0 bg-gradient-to-b from-aurora-purple/5 via-aurora-blue/5 to-aurora-green/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-aurora-purple/10 via-aurora-blue/10 to-aurora-green/10 opacity-30 pointer-events-none" />
      
      {/* Content container */}
      <div className="relative z-10">
        <NavigationBar />
        <main className="relative">
          <HeroSection />
          <div className="relative z-20">
            <FeaturesSection />
            <DemoSection />
            <UseCasesSection />
            <TestimonialsSection />
            <PricingSection />
          </div>
          <StickyCTA />
        </main>
      </div>
    </div>
  );
};

export default Index;
