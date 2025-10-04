import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl: string = 'https://rjzxerblvkelvjpvtfmn.supabase.co'
const supabaseKey: string = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_PUBLISHABLE_KEY environment variable')
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)

export default supabase
