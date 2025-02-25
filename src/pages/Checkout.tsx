
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Checkout = () => {
  return (
    <div className="max-w-md mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-orbitron font-bold text-white text-center">
        Checkout
      </h1>

      <Card className="p-6 bg-white/5 border-white/10">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-200">Pro Plan</span>
            <span className="text-gray-200">$49/month</span>
          </div>
          
          <hr className="border-white/10" />
          
          <div className="flex justify-between items-center">
            <span className="text-gray-200">Total</span>
            <span className="text-xl font-bold text-white">$49.00</span>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue 
                     hover:from-aurora-blue hover:to-aurora-purple"
          >
            Complete Purchase
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Checkout;
