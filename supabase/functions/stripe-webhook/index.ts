
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      throw new Error('Stripe environment variables are not set');
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase environment variables are not set');
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "No signature provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get the raw request body
    const body = await req.text();
    
    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error(`⚠️  Webhook signature verification failed:`, err.message);
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${err.message}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle the event
    let userId: string | null = null;
    let customerId: string | null = null;
    let subscriptionId: string | null = null;
    let status: string | null = null;
    let tier: 'free' | 'pro' | 'enterprise' = 'free';
    
    console.log(`Processing webhook event: ${event.type}`);
    
    // Extract common data based on event type
    if (event.type.startsWith('customer.subscription')) {
      const subscription = event.data.object;
      subscriptionId = subscription.id;
      customerId = subscription.customer;
      status = subscription.status;
      
      // Determine tier based on the price ID or product ID
      // This is simplified - you'd typically map specific price IDs to tiers
      if (subscription.items && subscription.items.data && subscription.items.data.length > 0) {
        const priceId = subscription.items.data[0].price.id;
        // Map price IDs to tiers - you'll need to adjust these based on your actual Stripe prices
        if (priceId.startsWith('price_pro_')) {
          tier = 'pro';
        } else if (priceId.startsWith('price_enterprise_')) {
          tier = 'enterprise';
        }
      }
      
      // Try to get the user ID from metadata
      if (subscription.metadata && subscription.metadata.userId) {
        userId = subscription.metadata.userId;
      }
      
      // If not in metadata, look it up in our database
      if (!userId) {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscriptionId)
          .single();
        
        if (!error && data) {
          userId = data.user_id;
        }
      }
    } else if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      customerId = session.customer;
      userId = session.metadata?.userId || session.client_reference_id;
      
      if (session.subscription) {
        subscriptionId = session.subscription;
        
        // Fetch the subscription to get status and pricing details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        status = subscription.status;
        
        // Determine tier based on the price ID
        if (subscription.items && subscription.items.data && subscription.items.data.length > 0) {
          const priceId = subscription.items.data[0].price.id;
          // Map price IDs to tiers - you'll need to adjust these based on your actual Stripe prices
          if (priceId.startsWith('price_pro_')) {
            tier = 'pro';
          } else if (priceId.startsWith('price_enterprise_')) {
            tier = 'enterprise';
          }
        }
      }
    }
    
    // Process event based on type
    switch (event.type) {
      case 'checkout.session.completed':
        if (userId && customerId && subscriptionId) {
          // Insert or update the subscription record
          const { data, error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              tier: tier,
              status: status || 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(
                new Date().setMonth(new Date().getMonth() + 1)
              ).toISOString(), // Default to 1 month
            })
            .select();
          
          if (error) {
            console.error("Error updating subscription:", error);
          } else {
            console.log("Subscription record updated:", data);
          }
        }
        break;
        
      case 'customer.subscription.updated':
      case 'customer.subscription.created':
        if (userId && subscriptionId) {
          const subscription = event.data.object;
          
          // Update the subscription record
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              tier: tier,
              status: status || 'active',
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            });
          
          if (error) {
            console.error("Error updating subscription:", error);
          } else {
            console.log("Subscription record updated for:", userId);
          }
        }
        break;
        
      case 'customer.subscription.deleted':
        if (subscriptionId) {
          // Find the subscription by ID and update its status
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              tier: 'free',
            })
            .eq('stripe_subscription_id', subscriptionId);
          
          if (error) {
            console.error("Error updating subscription status:", error);
          } else {
            console.log("Subscription marked as canceled:", subscriptionId);
          }
        }
        break;
        
      // You can add more event handlers as needed
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in stripe-webhook function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
