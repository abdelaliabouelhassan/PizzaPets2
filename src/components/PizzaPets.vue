<script setup>
import { ref, computed } from 'vue'

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

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(8)

const paginatedPets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return pets.slice(start, end)
})

const totalPages = computed(() => Math.ceil(pets.length / itemsPerPage.value))

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<template>
  <div class="max-w-[1140px] m-4">
    <div class="grid gap-x-4 gap-y-8 grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      <div v-for="(pet, i) in paginatedPets" :key="i" class="relative">
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
    <!-- Pagination Controls -->
    <div class="flex justify-center mt-12">
      <button
        :class="currentPage > 1 ? 'visible' : 'invisible'"
        class="px-4 py-2 mx-1 bg-black text-white w-[100px]"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>
      <span class="px-4 py-2 mx-1 text-white">{{ currentPage }} / {{ totalPages }}</span>
      <button
        :class="currentPage < totalPages ? 'visible' : 'invisible'"
        class="px-4 py-2 mx-1 bg-black text-white w-[100px]"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>
