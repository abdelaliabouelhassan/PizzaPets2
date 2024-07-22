<script setup>
import { useApiData } from '@/stores/apidata'
import { useOrderStore } from '@/stores/order'

const apiData = useApiData()
const orderStore = useOrderStore()

const toggleChildrenSelection = (option) => {
  orderStore.toggleChildrenSelectionFromOrder(option)
}

const getIconPath = (label) => {
  const imgUrl = `./images/${label}.png`
  return imgUrl
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4 px-4 mt-12 lg:grid-cols-6">
    <div
      v-for="(option, index) in apiData.getDelegates"
      :key="index"
      @click="toggleChildrenSelection(option)"
      :class="option.selected ? 'border-white' : 'border-transparent'"
      class="flex flex-col items-center justify-center p-4 text-white bg-black border-4 shadow cursor-pointer hover:border-white"
    >
      <img :src="getIconPath(option.label)" class="w-6 h-6 mb-2" alt="" />
      <span class="text-lg">{{ option.label }}</span>
    </div>
  </div>
</template>
