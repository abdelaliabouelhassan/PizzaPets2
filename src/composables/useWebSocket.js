import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/order'
import { realtime } from '@/utils/supabase'
import { ref } from 'vue'

export function useWebSocket() {
  const channel = ref(null)
  const authStore = useAuthStore()
  const orderStore = useOrderStore()

  function connectWebSocket() {
    channel.value = realtime
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
  }

  function disconnectWebSocket() {
    if (channel.value) {
      channel.value.unsubscribe()
      channel.value = null
    }
  }

  return {
    channel,
    connectWebSocket,
    disconnectWebSocket
  }
}
