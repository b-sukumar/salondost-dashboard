import { createClient } from '@supabase/supabase-js'

const sbUrl = 'https://trosqchwggudldwtzbno.supabase.co'
const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyb3NxY2h3Z2d1ZGxkd3R6Ym5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzUwODgsImV4cCI6MjA4NTExMTA4OH0.8a5SpZauGvD9byx9mwCJanRKjQF__nCQdocQ0ySd5Qo'

export const supabase = createClient(
    sbUrl,
    sbKey,
    {
        auth: {
            persistSession: false,
            detectSessionInUrl: true,
            flowType: 'implicit'
        }
    }
)
