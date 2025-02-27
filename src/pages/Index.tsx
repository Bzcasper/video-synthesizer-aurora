
import React, { useRef, lazy, Suspense } from 'react';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import PageLayout from '@/components/landing/PageLayout';
import StyleInitializer from '@/components/landing/StyleInitializer';

// Immediately load critical components
import BackgroundEffects from '@/components/landing/BackgroundEffects';
import MainContentWrapper from '@/components/landing/MainContentWrapper';
import HeroSection from '@/components/landing/HeroSection';

// Lazy load non-critical components
const ContentSections = lazy(() => import('@/components/landing/ContentSections'));

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
          <Suspense fallback={<div className="min-h-[200px]"></div>}>
            <ContentSections />
          </Suspense>
        </MainContentWrapper>
      </div>
    </PageLayout>
  );
};

export default Index;
