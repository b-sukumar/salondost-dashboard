import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://trosqchwggudldwtzbno.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SB_ANON_KEY || '';

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'implicit'
        }
    }
)
