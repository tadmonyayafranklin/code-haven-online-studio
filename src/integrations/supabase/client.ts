// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zcgylodjjjqhkywdriud.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZ3lsb2RqampxaGt5d2RyaXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MDY1OTMsImV4cCI6MjA2NTA4MjU5M30.tIEZ_8smFuGlo55Bv_BQitCZWJZJIROfXx4NEYHhpv8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);