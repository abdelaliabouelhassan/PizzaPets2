import { RealtimeClient } from '@supabase/realtime-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const realtime = new RealtimeClient(`${supabaseUrl}/realtime/v1`, {
  params: {
    apikey: supabaseKey
  }
})

export default realtime
