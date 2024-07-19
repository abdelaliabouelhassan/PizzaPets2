import { RealtimeClient } from '@supabase/realtime-js'

const supabaseWssUrl = import.meta.env.VITE_SUPABASE_WSS
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const realtime = new RealtimeClient(supabaseWssUrl, {
  params: {
    apikey: supabaseKey
  }
})

export default realtime
