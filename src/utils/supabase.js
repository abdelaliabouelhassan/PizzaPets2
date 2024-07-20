import { createClient, RealtimeClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export const realtime = new RealtimeClient(`${supabaseUrl}/realtime/v1`, {
  params: {
    apikey: supabaseKey
  }
})
