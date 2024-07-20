<template>
  <div class="grid grid-cols-2 gap-4 mt-12 lg:grid-cols-6">
    <div
      v-for="(option, index) in options"
      :key="index"
      @click="toggleSelection(option)"
      :class="apiData.files.includes(option) ? 'border-white' : 'border-transparent'"
      class="flex flex-col items-center justify-center p-4 text-white bg-black border-4 shadow cursor-pointer hover:border-white"
    >
      <img :src="getIconPath(option.label)" class="w-6 h-6 mb-2" alt="" />
      <span class="text-lg">{{ option.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { useApiData } from '@/stores/apidata'

const options = [
  { label: 'Pizza' },
  { label: 'Shower' },
  { label: 'Milk' },
  { label: 'Coffee' },
  { label: 'Steroids' },
  { label: 'Weed' },
  { label: 'Cocaine' },
  { label: 'LSD' },
  { label: 'Beer' },
  { label: 'DMT' },
  { label: 'Ketamine' },
  { label: 'Molly' }
]
const apiData = useApiData()
const toggleSelection = (index) => {
  if (apiData.files.includes(index)) {
    apiData.files = apiData.files.filter((i) => i !== index)
  } else {
    apiData.files.push(index)
  }
}

const getIconPath = (label) => {
  const imgUrl = `./icons/${label}.png`
  return imgUrl
}
</script>
