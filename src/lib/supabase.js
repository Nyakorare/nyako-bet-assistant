// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qfsvcqxiotjkznvtrmox.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmc3ZjcXhpb3Rqa3pudnRybW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NjQxMzMsImV4cCI6MjA1OTI0MDEzM30.9zCNAy0sjdnTcBfLN4_jEi2ojnYMypQxnTwUhfDw_9A"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)