// src/stores/websocket.js
import realtime from '@/utils/realtime'
import { defineStore } from 'pinia'

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    channel: null
  }),
  actions: {
    connectWebSocket() {
      this.channel = realtime
        .channel('orders-channel')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders' },
          async (payload) => {
            console.log('UPDATE', payload)
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
