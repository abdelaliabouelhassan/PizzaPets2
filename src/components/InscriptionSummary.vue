<script setup>
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { computed, watch, ref } from 'vue'
import { useApiData } from '@/stores/apidata'
import { useOrderStore } from '@/stores/order'

const apiData = useApiData()
const orderStore = useOrderStore()

const selectedParents = computed(() => apiData.selectedParents)

const totalParents = ref(0)

watch(
  selectedParents,
  (newVal, oldVal) => {
    if (newVal) {
      totalParents.value = newVal.length
    } else {
      totalParents.value = oldVal.length
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex items-center justify-end gap-x-12 px-4 mt-24">
    <h5 class="text-2xl font-semibold">
      You are going to feed
      {{ totalParents }} {{ totalParents > 1 ? 'pets' : 'pet' }}
    </h5>
    <AppButton
      :disabled="orderStore.isFetching"
      :isLoading="orderStore.isFetching"
      label="Submit"
      @click="orderStore.handleDirectOrderButtonClick"
    />
  </div>

  <AppModal modalId="order-summary">
    <h1>CURRENT ORDER ID: {{ orderStore.getCurrentOrderId }}</h1>
    <h1>ALL ORDERS: {{ orderStore.getOrders }}</h1>
  </AppModal>
</template>
