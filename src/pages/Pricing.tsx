import React from "react";
import PricingSection from "@/components/landing/PricingSection";
import NavigationBar from "@/components/landing/NavigationBar";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-aurora-black">
      <NavigationBar />
      <PricingSection />
    </div>
  );
};

export default Pricing;
