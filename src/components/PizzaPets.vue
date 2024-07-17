<script setup>
import { ref } from 'vue'

// Generate 100 pet objects
const pets = Array.from({ length: 10 }, (_, index) => ({
  inscriptionId: `pet-${index}`,
  source: './pet.png'
}))

const selectedPets = ref([])

const toggleSelection = (pet) => {
  const index = selectedPets.value.findIndex((p) => p.inscriptionId === pet.inscriptionId)
  if (index !== -1) {
    selectedPets.value = selectedPets.value.filter((f) => f.inscriptionId !== pet.inscriptionId)
  } else {
    selectedPets.value.push(pet)
  }
}
</script>

<template>
  <div class="max-w-[1140px] m-4">
    <div
      class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    >
      <div v-for="(pet, i) in pets" :key="i" class="relative">
        <div
          class="group bg-gray-100 focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-gray-100 cursor-pointer hover:scale-105 duration-200"
          :class="{
            'ring-4 ring-white': selectedPets?.some((p) => p.inscriptionId === pet.inscriptionId)
          }"
          @click="toggleSelection(pet)"
        >
          <img :src="pet.source" alt="" class="object-cover group-hover:opacity-75" />
        </div>
      </div>
    </div>
  </div>
</template>
