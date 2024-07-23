<script setup>
import AppHeader from './components/ui/AppHeader.vue'
import PizzaPets from './components/PizzaPets.vue'
import ChildrenInscriptions from './components/ChildrenInscriptions.vue'
import InscriptionSummary from './components/InscriptionSummary.vue'
import FeeRate from './components/FeeRate.vue'
import { computed, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import { useApiData } from './stores/apidata'
import { useWebSocket } from './composables/useWebSocket'

const authStore = useAuthStore()
const apiData = useApiData()

const { connectWebSocket, disconnectWebSocket } = useWebSocket()

const isLoggedIn = computed(() => authStore.isLoggedIn)
const ordinalAddress = computed(() => authStore.getOrdinalAddress)

watch(
  isLoggedIn,
  (newVal) => {
    if (newVal) {
      apiData.fetchParents(ordinalAddress.value)
      connectWebSocket()
    } else {
      disconnectWebSocket()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="max-w-[1170px] mx-auto mt-12 px-4 mb-24">
    <AppHeader />
    <h1 class="mt-16 mb-8 ml-4 text-4xl text-white uppercase">My pets</h1>
    <PizzaPets />
    <h2 class="mb-8 ml-4 text-4xl text-white uppercase mt-14">Feed your pets</h2>
    <ChildrenInscriptions />
    <FeeRate />
    <InscriptionSummary />
  </div>
</template>
