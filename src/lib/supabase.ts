import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = createClient(
  URL || 'https://placeholder.supabase.co',
  KEY || 'placeholder-key',
);

export const supabaseReady = Boolean(URL && KEY);
