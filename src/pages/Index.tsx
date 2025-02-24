
import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import DemoSection from '@/components/landing/DemoSection';
import UseCasesSection from '@/components/landing/UseCasesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import StickyCTA from '@/components/landing/StickyCTA';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <UseCasesSection />
      <TestimonialsSection />
      <PricingSection />
      <StickyCTA />
    </div>
  );
};

export default Index;
