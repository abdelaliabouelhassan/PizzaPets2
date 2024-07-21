<script setup>
import AppHeader from './components/ui/AppHeader.vue'
import PizzaPets from './components/PizzaPets.vue'
import ChildrenInscriptions from './components/ChildrenInscriptions.vue'
import InscriptionSummary from './components/InscriptionSummary.vue'
import { computed, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import { useWebSocketStore } from './stores/websocket'

const authStore = useAuthStore()
const webSocketStore = useWebSocketStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)

watch(
  isLoggedIn,
  (newVal) => {
    if (newVal) {
      webSocketStore.connectWebSocket()
    } else {
      webSocketStore.disconnectWebSocket()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="max-w-[1170px] mx-auto mt-12 px-4 mb-24">
    <AppHeader />
    <h1 class="uppercase text-4xl mt-16 mb-8 text-white ml-4">My pets</h1>
    <PizzaPets />
    <h2 class="uppercase text-4xl mt-14 mb-8 text-white ml-4">Feed your pets</h2>
    <ChildrenInscriptions />
    <InscriptionSummary />
  </div>
</template>
