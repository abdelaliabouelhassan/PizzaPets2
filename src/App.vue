<script setup>
import DefaultLayout from './layouts/AppDefault.vue'
import AppNavigation from './components/ui/AppNavigation.vue'
import SelectPets from './components/SelectPets.vue'
import ChildrenInscriptions from './components/ChildrenInscriptions.vue'
// import InscriptionSummary from './components/InscriptionSummary.vue'
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
  <DefaultLayout class="mx-auto">
    <AppNavigation />
    <SelectPets />
    <ChildrenInscriptions />
    <FeeRate />
    <!-- <InscriptionSummary /> -->
  </DefaultLayout>
</template>
