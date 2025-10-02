
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjzxerblvkelvjpvtfmn.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase