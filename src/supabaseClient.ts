import { createClient } from "@supabase/supabase-js";

// Figure out .env files
const URL = "https://sldkyebwbtgvlqaqlzna.supabase.co"
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZGt5ZWJ3YnRndmxxYXFsem5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMyNDEwNTcsImV4cCI6MjAwODgxNzA1N30.KnPEqmzPvltNviMxqzgbY3vlz2o3tQImC8m9Re6RWNA"

export const supabase = createClient(URL, anonKey);