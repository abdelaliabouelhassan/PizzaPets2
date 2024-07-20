import { realtime } from '@/utils/supabase'
import { defineStore } from 'pinia'
import { useOrderStore } from './order'

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    channel: null
  }),
  actions: {
    connectWebSocket() {
      const orderStore = useOrderStore()
      this.channel = realtime
        .channel('orders-channel')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders' },
          async (payload) => {
            console.log('ORDER UPDATE', payload)
            await orderStore.updateOrCreateOrder(payload.new)
            await orderStore.createParentChildPsbt(payload.new.order_id)
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
