import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    console.error("Vercel Error: URL is missing from environment!");
}

export const supabase = createClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
        auth: {
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'implicit'
        }
    }
)
