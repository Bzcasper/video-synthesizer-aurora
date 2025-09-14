import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, CreditCard, Shield, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import PageLayout from "@/components/landing/PageLayout";
import MainContentWrapper from "@/components/landing/MainContentWrapper";

const Checkout = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [isLoading, setIsLoading] = useState(false);

  const planDetails = {
    monthly: {
      price: "$49",
      period: "month",
      discount: null,
      billingCycle: "monthly",
    },
    annual: {
      price: "$470",
      period: "year",
      discount: "20%",
      billingCycle: "annually",
    },
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call a Supabase Edge Function to create
      // a Stripe Checkout Session, then redirect to Stripe
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to complete your purchase",
          variant: "destructive",
        });
        navigate("/login", { state: { from: "/checkout" } });
        return;
      }

      // For demo purposes, we'll just show a toast and redirect
      toast({
        title: "Redirecting to Stripe",
        description: `Setting up your ${selectedPlan} Pro subscription...`,
      });

      // Here you would typically redirect to Stripe Checkout URL
      // window.location.href = checkoutUrl;

      // For demo, we'll just simulate the process
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Subscription Activated",
          description: "Your Pro subscription has been successfully activated!",
        });
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
      toast({
        title: "Checkout Error",
        description:
          "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout>
      <MainContentWrapper>
        <div className="max-w-3xl mx-auto space-y-6 p-4 sm:p-6">
          <Button
            variant="ghost"
            className="mb-4 -ml-2 text-gray-400 hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <h1 className="text-3xl font-orbitron font-bold text-white text-center mb-6">
            Upgrade to Aurora Pro
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Card className="glass-panel bg-gradient-to-br from-aurora-blue/10 to-aurora-purple/5 border-aurora-blue/30 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-aurora-blue" />
                  Aurora Pro Benefits
                </h2>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <span>Unlimited video generations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <span>HD & 4K resolution options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <span>Priority video processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <span>Access to premium AI styles & effects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <span>Preview upcoming features</span>
                  </li>
                </ul>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-sm text-gray-300">
                    Need enterprise features like custom branding, bulk
                    processing, or API access?
                  </p>
                  <a
                    href="mailto:enterprise@auroravideosynth.com"
                    className="text-sm text-aurora-blue hover:text-aurora-purple mt-1 inline-block"
                  >
                    Contact us for Enterprise pricing →
                  </a>
                </div>
              </Card>
            </div>

            <div>
              <Card className="glass-panel p-6 border-white/10">
                <h2 className="text-xl font-semibold mb-4">
                  Subscription Plan
                </h2>

                <RadioGroup
                  defaultValue="monthly"
                  value={selectedPlan}
                  onValueChange={(value) =>
                    setSelectedPlan(value as "monthly" | "annual")
                  }
                  className="mb-6"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label
                      htmlFor="monthly"
                      className="flex flex-1 justify-between"
                    >
                      <span>Monthly billing</span>
                      <span className="font-semibold">$49/month</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="annual" id="annual" />
                    <Label
                      htmlFor="annual"
                      className="flex flex-1 justify-between"
                    >
                      <div>
                        <span>Annual billing</span>
                        <span className="ml-2 bg-green-500/20 text-green-300 text-xs py-0.5 px-1.5 rounded">
                          Save 20%
                        </span>
                      </div>
                      <span className="font-semibold">$470/year</span>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Pro Plan ({selectedPlan})</span>
                    <span>{planDetails[selectedPlan].price}</span>
                  </div>

                  {planDetails[selectedPlan].discount && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Annual discount</span>
                      <span>-{planDetails[selectedPlan].discount}</span>
                    </div>
                  )}

                  <Separator className="my-2 bg-white/10" />

                  <div className="flex justify-between font-semibold">
                    <span>
                      Total ({planDetails[selectedPlan].billingCycle})
                    </span>
                    <span>{planDetails[selectedPlan].price}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue 
                              hover:from-aurora-blue hover:to-aurora-purple flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Complete Purchase
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Shield className="h-3 w-3" />
                    <span>Secure payment processing by Stripe</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </MainContentWrapper>
    </PageLayout>
  );
};

export default Checkout;
