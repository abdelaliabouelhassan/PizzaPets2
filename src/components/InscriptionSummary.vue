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
  (newVal) => {
    if (newVal) {
      totalParents.value = newVal.length
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="mt-24 flex items-center justify-end gap-x-12 px-4">
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
    <h1>ORDER ID: {{ orderStore.getCurrentOrderId }}</h1>
    <h1 v-if="orderStore.getOrder">ORDER STATUS: {{ orderStore.getOrder.order_status }}</h1>
    <a
      v-if="orderStore.getTxId"
      :href="`https://mempool.space/tx/${orderStore.getTxId}`"
      target="_blank"
    >
      TX: {{ orderStore.getTxId }}
    </a>
  </AppModal>
</template>
