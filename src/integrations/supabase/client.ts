// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://voaorlwianfzffcpimdj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYW9ybHdpYW5memZmY3BpbWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzOTEzOTEsImV4cCI6MjA1NDk2NzM5MX0.-NF6dJE1M3klCHVDRmxjcJm_AY5zKiq_wEQDwsGlYPc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);