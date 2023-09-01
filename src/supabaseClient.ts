import { createClient } from "@supabase/supabase-js";

const url:string = import.meta.env.VITE_SUPABASE_URL;
const anonKey:string = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anonKey);