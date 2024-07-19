<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'
import { useApiData } from '@/stores/apidatas'

// State and reactive variables
const pets = ref([])
const selectedPets = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(8)
const authStore = useAuthStore()
const apiData = useApiData()

const tempData = [
  {
    inscription_id: '1ae057680c2b88cceb4faaf14da6591b7b328b6a9e335d0c198fd078c55b5376i0',
    content_type: 'image/svg+xml',
    owner_address: 'tb1pk5uh44r9hk9z33ygpkrqcnupaw28q07xvg9eu7utv4wv3d3q58pqj859wl',
    content_url:
      'https://static-testnet.unisat.io/content/1ae057680c2b88cceb4faaf14da6591b7b328b6a9e335d0c198fd078c55b5376i0'
  },
  {
    inscription_id: '659193e72b8894ec341c8597c7efbb31b0b99f71706109a05d15d8df5ad9ad51i0',
    content_type: 'image/svg+xml',
    owner_address: 'tb1pk5uh44r9hk9z33ygpkrqcnupaw28q07xvg9eu7utv4wv3d3q58pqj859wl',
    content_url:
      'https://static-testnet.unisat.io/content/659193e72b8894ec341c8597c7efbb31b0b99f71706109a05d15d8df5ad9ad51i0'
  },
  {
    inscription_id: '6d99428d056b7fba8b9e63fa4491ab769fabdcb94bc2f5cfd92e333705e2be00i0',
    content_type: 'image/svg+xml',
    owner_address: 'tb1pk5uh44r9hk9z33ygpkrqcnupaw28q07xvg9eu7utv4wv3d3q58pqj859wl',
    content_url:
      'https://static-testnet.unisat.io/content/6d99428d056b7fba8b9e63fa4491ab769fabdcb94bc2f5cfd92e333705e2be00i0'
  },
  {
    inscription_id: 'e2d8578e80e459b7669bcb5072010da5bc930f85c0007c611c83fbd53717da2fi0',
    content_type: 'image/svg+xml',
    owner_address: 'tb1pk5uh44r9hk9z33ygpkrqcnupaw28q07xvg9eu7utv4wv3d3q58pqj859wl',
    content_url:
      'https://static-testnet.unisat.io/content/e2d8578e80e459b7669bcb5072010da5bc930f85c0007c611c83fbd53717da2fi0'
  }
]

// Fetch pets from the API ${authStore.walletAddress} bc1pr8vjq0fk89f5sw3r4n9scrasvw7kaud9akhzw57c3ygycsjspvvseyjcma
const fetchPets = async () => {
  try {
    if (import.meta.env.VITE_NETWORK == 'mainnet') {
      const response = await axios.get(
        `${window.location.origin}/.netlify/functions/owned-inscriptions?address=bc1pr8vjq0fk89f5sw3r4n9scrasvw7kaud9akhzw57c3ygycsjspvvseyjcma`
      )
      pets.value = response.data[0].data
    } else {
      pets.value = tempData
    }
  } catch (error) {
    console.error('Error fetching pets:', error)
  }
}

// Toggle pet selection
const toggleSelection = (pet) => {
  const index = selectedPets.value.findIndex((p) => p.inscription_id === pet.inscription_id)
  if (index !== -1) {
    selectedPets.value = selectedPets.value.filter((f) => f.inscription_id !== pet.inscription_id)
  } else {
    console.log(selectedPets.value)
    selectedPets.value.push(pet)
  }
}

// Watch for changes in wallet address
watch(
  () => authStore.walletAddress,
  (newAddress, oldAddress) => {
    if (newAddress !== oldAddress) {
      if (newAddress) {
        fetchPets()
      } else {
        pets.value = []
        selectedPets.value = []
      }
    }
  }
)

// Fetch pets on component mount if wallet address is available
onMounted(() => {
  if (authStore.walletAddress) {
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
            'ring-4 ring-white': selectedPets.some((p) => p.inscription_id === pet.inscription_id)
          }"
          @click="toggleSelection(pet)"
        >
          <img
            v-if="pet.content_type.startsWith('image/')"
            :src="pet.content_url"
            alt=""
            class="object-cover w-full h-full group-hover:opacity-75"
          />
          <video
            v-else-if="pet.content_type.startsWith('video/')"
            autoplay
            loop
            class="object-cover w-full h-full group-hover:opacity-75"
          >
            <source :src="pet.content_url" :type="pet.content_type" />
          </video>
          <iframe
            v-else-if="pet.content_type.startsWith('text/')"
            :src="pet.content_url"
            :title="`text ${i + 1}`"
            class="object-cover w-full h-full group-hover:opacity-75"
          ></iframe>
          <iframe
            v-else-if="pet.content_type.startsWith('text/html')"
            :src="pet.content_url"
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
