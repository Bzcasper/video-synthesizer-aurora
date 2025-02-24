
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "0",
    features: [
      "5 video generations per month",
      "720p resolution",
      "Basic text-to-video",
      "Standard templates",
      "Community support"
    ]
  },
  {
    name: "Pro",
    price: "49",
    features: [
      "Unlimited video generations",
      "4K resolution",
      "Advanced AI features",
      "Priority processing",
      "Custom templates",
      "Email support"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Dedicated infrastructure",
      "API access",
      "Custom branding",
      "Advanced analytics",
      "Custom integrations",
      "24/7 priority support"
    ]
  }
];

const PricingSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/90">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Choose Your Plan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`glass-panel p-8 hover-glow transition-all duration-300 animate-fade-in relative
                        ${plan.popular ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20' : 'border-white/10'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-gray-100 mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-100">${plan.price}</span>
                {plan.price !== "Custom" && <span className="text-gray-400">/month</span>}
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-emerald-400 mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plan.popular
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
