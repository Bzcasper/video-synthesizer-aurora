
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export type StripeCheckoutOptions = {
  priceId: string;
  returnUrl?: string;
};

export type StripePortalOptions = {
  returnUrl?: string;
};

const useStripe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createCheckoutSession = async (options: StripeCheckoutOptions) => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to complete your purchase",
          variant: "destructive"
        });
        return null;
      }
      
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          action: 'create-checkout-session',
          userId: session.user.id,
          priceId: options.priceId,
          returnUrl: options.returnUrl,
        },
      });
      
      if (error) {
        throw error;
      }
      
      return data;
      
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Checkout Error",
        description: "There was a problem starting the checkout process. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToCustomerPortal = async (options?: StripePortalOptions) => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to manage your subscription",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          action: 'customer-portal',
          userId: session.user.id,
          returnUrl: options?.returnUrl,
        },
      });
      
      if (error) {
        throw error;
      }
      
      // Redirect to the portal URL
      if (data.url) {
        window.location.href = data.url;
      }
      
    } catch (error) {
      console.error("Error redirecting to customer portal:", error);
      toast({
        title: "Portal Error",
        description: "There was a problem accessing your subscription management portal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createCheckoutSession,
    redirectToCustomerPortal,
  };
};

export default useStripe;
