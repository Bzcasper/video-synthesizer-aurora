
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
    <div className="min-h-screen bg-aurora-black text-aurora-white overflow-x-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-aurora-purple/5 via-aurora-blue/5 to-aurora-green/5 pointer-events-none" />
      
      {/* Particle effect overlay */}
      <div className="fixed inset-0 particle-background opacity-20 pointer-events-none" />
      
      {/* Content */}
      <div className="relative">
        <NavigationBar />
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <UseCasesSection />
        <TestimonialsSection />
        <PricingSection />
        <StickyCTA />
      </div>
    </div>
  );
};

export default Index;
