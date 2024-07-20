import realtime from '@/utils/realtime'
import { defineStore } from 'pinia'
import { useApiData } from './apidata'

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    channel: null
  }),
  actions: {
    connectWebSocket() {
      const apiDataStore = useApiData()
      this.channel = realtime
        .channel('orders-channel')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders' },
          async (payload) => {
            console.log('UPDATE', payload)
            // Call updateOrCreateOrder with the payload data
            apiDataStore.updateOrCreateOrder(payload.new)
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
