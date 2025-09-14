import React, { useRef, lazy, Suspense } from "react";
import { useScrollVisibility } from "@/hooks/useScrollVisibility";
import PageLayout from "@/components/landing/PageLayout";
import StyleInitializer from "@/components/landing/StyleInitializer";

// Immediately load critical components
import BackgroundEffects from "@/components/landing/BackgroundEffects";
import MainContentWrapper from "@/components/landing/MainContentWrapper";
import HeroSection from "@/components/landing/HeroSection";

// Lazy load non-critical components
const ContentSections = lazy(
  () => import("@/components/landing/ContentSections"),
);

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  useScrollVisibility();

  return (
    <PageLayout>
      <StyleInitializer />
      <div ref={mainRef} className="flex flex-col min-h-screen">
        <BackgroundEffects />
        <MainContentWrapper>
          <HeroSection />
          <Suspense
            fallback={
              <div className="min-h-[200px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-aurora-blue"></div>
              </div>
            }
          >
            <ContentSections />
          </Suspense>
        </MainContentWrapper>
      </div>
    </PageLayout>
  );
};

export default Index;
