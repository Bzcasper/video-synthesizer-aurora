
import React from 'react';
import PageLayout from '@/components/landing/PageLayout';
import HeroSection from '@/components/landing/HeroSection';
import ContentSections from '@/components/landing/ContentSections';
import NavigationBar from '@/components/landing/NavigationBar';

const Index = () => {
  return (
    <PageLayout>
      <div className="min-h-screen w-full">
        <NavigationBar />
        <main className="flex-1 w-full">
          <HeroSection />
          <ContentSections />
        </main>
      </div>
    </PageLayout>
  );
};

export default Index;
