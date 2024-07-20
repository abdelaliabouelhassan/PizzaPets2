<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'
import { useApiData } from '@/stores/apidata'

// State and reactive variables
const pets = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(8)
const authStore = useAuthStore()
const apiData = useApiData()

// Fetch pets from the API
const fetchPets = async () => {
  try {
    const response = await axios.get(
      `${window.location.origin}/.netlify/functions/owned-inscriptions?address=tb1pk5uh44r9hk9z33ygpkrqcnupaw28q07xvg9eu7utv4wv3d3q58pqj859wl`
    )
    pets.value = response.data
  } catch (error) {
    console.error('Error fetching pets:', error)
  }
}

// Toggle pet selection
const toggleSelection = (pet) => {
  const index = apiData.parents.findIndex((p) => p.inscriptionId === pet.inscriptionId)
  if (index !== -1) {
    apiData.parents = apiData.parents.filter((f) => f.inscriptionId !== pet.inscriptionId)
  } else {
    apiData.parents.push(pet)
  }
}

// Watch for changes in wallet address
watch(
  () => authStore.paymentAddress,
  (newAddress, oldAddress) => {
    if (newAddress !== oldAddress) {
      if (newAddress) {
        fetchPets()
      } else {
        pets.value = []
        apiData.parents = []
      }
    }
  }
)

// Fetch pets on component mount if wallet address is available
onMounted(() => {
  if (authStore.paymentAddress) {
    fetchPets()
  }
})

// Pagination logic
const paginatedPets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return pets.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(pets.value.length / itemsPerPage.value))

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<template>
  <div class="max-w-[1140px] m-4">
    <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      <div v-for="(pet, i) in paginatedPets" :key="i" class="relative">
        <div
          class="h-full duration-200 bg-gray-100 cursor-pointer group focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-gray-100 hover:scale-105"
          :class="{
            'ring-4 ring-balck': apiData.parents.some((p) => p.inscriptionId === pet.inscriptionId)
          }"
          @click="toggleSelection(pet)"
        >
          <img
            v-if="pet.contentType.startsWith('image/')"
            :src="`https://static-testnet.unisat.io/content/${pet.inscriptionId}`"
            alt=""
            class="object-cover w-full h-full group-hover:opacity-75"
          />
          <video
            v-else-if="pet.contentType.startsWith('video/')"
            autoplay
            loop
            class="object-cover w-full h-full group-hover:opacity-75"
          >
            <source
              :src="`https://static-testnet.unisat.io/content/${pet.inscriptionId}`"
              :type="pet.contentType"
            />
          </video>
          <iframe
            v-else-if="pet.contentType.startsWith('text/')"
            :src="`https://static-testnet.unisat.io/content/${pet.inscriptionId}`"
            :title="`text ${i + 1}`"
            class="object-cover w-full h-full group-hover:opacity-75"
          ></iframe>
          <iframe
            v-else-if="pet.contentType.startsWith('text/html')"
            :src="`https://static-testnet.unisat.io/content/${pet.inscriptionId}`"
            :title="`html ${i + 1}`"
            class="object-cover w-full h-full group-hover:opacity-75"
          ></iframe>
        </div>
      </div>
    </div>
    <!-- Pagination Controls -->
    <div v-if="authStore.walletAddress" class="flex justify-center mt-12">
      <button
        :class="currentPage > 1 ? 'visible' : 'invisible'"
        class="px-4 py-2 mx-1 bg-black text-white w-[100px]"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>
      <span v-if="totalPages > 1" class="px-4 py-2 mx-1 text-white"
        >{{ currentPage }} / {{ totalPages }}</span
      >
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
