
import React, { useRef } from 'react';
import BackgroundEffects from '@/components/landing/BackgroundEffects';
import MainContentWrapper from '@/components/landing/MainContentWrapper';
import HeroSection from '@/components/landing/HeroSection';
import ContentSections from '@/components/landing/ContentSections';
import PageLayout from '@/components/landing/PageLayout';
import StyleInitializer from '@/components/landing/StyleInitializer';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  useScrollVisibility();

  return (
    <PageLayout>
      <StyleInitializer />
      <div ref={mainRef}>
        <BackgroundEffects />
        <MainContentWrapper>
          <HeroSection />
          <ContentSections />
        </MainContentWrapper>
      </div>
    </PageLayout>
  );
};

export default Index;
