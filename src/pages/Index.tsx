
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
  // Add parallax effect on scroll
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
    <main className="relative min-h-screen bg-aurora-black text-aurora-white overflow-x-hidden">
      {/* Fixed background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-aurora-purple/5 via-aurora-blue/5 to-aurora-green/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-aurora-purple/10 via-aurora-blue/10 to-aurora-green/10 opacity-30 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        <NavigationBar />
        <div className="relative space-y-0">
          <HeroSection />
          <FeaturesSection />
          <DemoSection />
          <UseCasesSection />
          <TestimonialsSection />
          <PricingSection />
          <StickyCTA />
        </div>
      </div>
    </main>
  );
};

export default Index;
