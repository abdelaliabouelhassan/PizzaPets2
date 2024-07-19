import { RealtimeClient } from '@supabase/realtime-js'

const supabaseWssUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const realtime = new RealtimeClient(`${supabaseWssUrl}/realtime/v1`, {
  params: {
    apikey: supabaseKey
  }
})

export default realtime
