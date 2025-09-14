// supabase/functions/_shared/cors.ts

// Define CORS headers for Edge Functions
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // In production, replace with specific origins
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Authorization, X-Client-Info, Content-Type, X-Requested-With",
  "Access-Control-Max-Age": "86400", // 24 hours cache for preflight requests
};
