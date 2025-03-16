
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UpgradeCardProps {
  currentTier: 'free' | 'pro' | 'enterprise';
}

const UpgradeCard: React.FC<UpgradeCardProps> = ({ currentTier }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);

  const handleUpgrade = async () => {
    if (currentTier === 'free') {
      // For now, just navigate to the checkout page
      navigate('/checkout');
    } else if (currentTier === 'pro') {
      // Pro users can upgrade to enterprise via contact
      window.open('mailto:support@auroravideosynth.com?subject=Enterprise%20Upgrade%20Inquiry', '_blank');
    }
  };

  const handleManageSubscription = () => {
    // This would typically take the user to a customer portal to manage their subscription
    toast({
      title: "Subscription Management",
      description: "This would take you to the Stripe Customer Portal to manage your subscription.",
    });
  };

  return (
    <Card className={`glass-panel h-full border-white/10 ${
      currentTier === 'pro' 
        ? 'bg-gradient-to-br from-aurora-blue/10 to-aurora-purple/5 border-aurora-blue/30' 
        : currentTier === 'enterprise' 
          ? 'bg-gradient-to-br from-aurora-purple/10 to-aurora-green/5 border-aurora-purple/30'
          : ''
    }`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className={`h-5 w-5 ${
                currentTier === 'free' 
                  ? 'text-gray-400' 
                  : currentTier === 'pro' 
                    ? 'text-aurora-blue' 
                    : 'text-aurora-purple'
              }`} />
              Your Plan
            </CardTitle>
            <CardDescription>
              {currentTier === 'free' 
                ? 'Free Tier' 
                : currentTier === 'pro' 
                  ? 'Pro Subscription' 
                  : 'Enterprise Plan'}
            </CardDescription>
          </div>
          {currentTier !== 'free' && (
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50">
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          <div>
            <p className="text-xl font-semibold">
              {currentTier === 'free' 
                ? 'Free' 
                : currentTier === 'pro' 
                  ? '$49' 
                  : 'Custom'}
            </p>
            {currentTier !== 'free' && <p className="text-sm text-gray-400">per month</p>}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm">
                {currentTier === 'free' 
                  ? '5 videos per month' 
                  : 'Unlimited videos'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm">
                {currentTier === 'free' 
                  ? '720p resolution' 
                  : 'Up to 4K resolution'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm">
                {currentTier === 'free' 
                  ? 'Basic video styles' 
                  : 'Premium video styles'}
              </span>
            </div>
            
            {showDetails && (
              <>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${currentTier !== 'free' ? 'text-green-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${currentTier !== 'free' ? 'text-white' : 'text-gray-500'}`}>
                    {currentTier === 'free' 
                      ? 'Standard processing (Pro only)' 
                      : 'Priority processing'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${currentTier !== 'free' ? 'text-green-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${currentTier !== 'free' ? 'text-white' : 'text-gray-500'}`}>
                    {currentTier === 'free' 
                      ? 'Basic support (Pro only)' 
                      : 'Priority support'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${currentTier === 'enterprise' ? 'text-green-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${currentTier === 'enterprise' ? 'text-white' : 'text-gray-500'}`}>
                    {currentTier === 'enterprise' 
                      ? 'Custom branding' 
                      : 'Custom branding (Enterprise only)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${currentTier === 'enterprise' ? 'text-green-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${currentTier === 'enterprise' ? 'text-white' : 'text-gray-500'}`}>
                    {currentTier === 'enterprise' 
                      ? 'API access' 
                      : 'API access (Enterprise only)'}
                  </span>
                </div>
              </>
            )}
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-xs text-gray-400 mt-1 hover:text-white"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Show all features
                </>
              )}
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        {currentTier === 'free' ? (
          <Button 
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue 
                     hover:from-aurora-blue hover:to-aurora-purple"
          >
            Upgrade to Pro
          </Button>
        ) : currentTier === 'pro' ? (
          <>
            <Button 
              onClick={handleManageSubscription}
              variant="outline" 
              className="w-full border-white/20 hover:bg-white/5"
            >
              Manage Subscription
            </Button>
            <Button 
              onClick={handleUpgrade}
              variant="ghost" 
              className="w-full text-sm text-gray-300 hover:text-white hover:bg-white/5"
            >
              Contact Us for Enterprise
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleManageSubscription}
            variant="outline" 
            className="w-full border-white/20 hover:bg-white/5"
          >
            Manage Enterprise Plan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UpgradeCard;
