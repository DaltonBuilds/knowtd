import { createClient } from "@supabase/supabase-js";

// Type guard for environment variables
const getEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// Explicitly typed config
const supabaseConfig = {
  url: getEnvVar("VITE_SUPABASE_URL"),
  key: getEnvVar("VITE_SUPABASE_API_KEY"),
};

export const supabase = createClient(supabaseConfig.url, supabaseConfig.key);
