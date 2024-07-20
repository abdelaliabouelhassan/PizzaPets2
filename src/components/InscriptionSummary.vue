<script setup>
import AppModal from '@/components/AppModal.vue'
import AppLoader from '@/components/icons/AppLoader.vue'
import { useApiData } from '@/stores/apidata'
import { useOrderStore } from '@/stores/order'

const apiData = useApiData()
const orderStore = useOrderStore()
</script>

<template>
  <div class="flex items-center justify-end gap-x-12 px-4 mt-24">
    <h5 class="text-2xl font-semibold">
      You are going to feed {{ apiData.getParents?.length ? apiData.getParents.length : 0 }} pet
    </h5>
    <button
      :disabled="orderStore.isFetching"
      @click="orderStore.handleDirectOrderButtonClick"
      class="flex items-center justify-center gap-x-4 py-3 px-4 bg-[#FF5400] text-white text-[18px] h-[48px] min-w-[178px] border-4 border-black ring-4 ring-white hover:scale-105 duration-200 mr-1 cursor-pointer flex items-center justify-center"
    >
      <span> Submit </span>
      <AppLoader v-if="orderStore.isFetching" />
    </button>
  </div>

  <AppModal modalId="order-summary">
    <h1>ORDER ID: {{ orderStore.getOrderId }}</h1>
    <h1>ORDERS: {{ orderStore.getOrders }}</h1>
  </AppModal>
</template>
