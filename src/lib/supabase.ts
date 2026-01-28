```javascript
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace these with your actual Supabase URL and Anon Key
// It is recommended to use environment variables for security.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
```
