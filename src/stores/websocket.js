import { realtime } from '@/utils/supabase'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useOrderStore } from './order'

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    channel: null
  }),
  actions: {
    connectWebSocket() {
      const orderStore = useOrderStore()
      const authStore = useAuthStore()
      this.channel = realtime
        .channel('orders-channel')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `ordinal_address=eq.${authStore.getOrdinalAddress}`
          },
          async (payload) => {
            orderStore.handleOrderUpdate(payload.new)
          }
        )
        .subscribe()
    },
    disconnectWebSocket() {
      if (this.channel) {
        this.channel.unsubscribe()
        this.channel = null
      }
    }
  }
})
