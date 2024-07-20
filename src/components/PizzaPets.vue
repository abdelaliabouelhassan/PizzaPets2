<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useApiData } from '@/stores/apidata'

const currentPage = ref(1)
const itemsPerPage = ref(8)
const authStore = useAuthStore()
const apiData = useApiData()

const ordinalAddress = computed(() => authStore.getOrdinalAddress)

const getPets = computed(() => apiData.getPets)

watch(
  ordinalAddress,
  // eslint-disable-next-line no-unused-vars
  (newAddress, oldAddress) => {
    if (newAddress) {
      apiData.fetchPets(newAddress)
    }
  },
  { immediate: true }
)

const paginatedPets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return getPets.value?.slice(start, end)
})

const totalPages = computed(() => Math.ceil(getPets.value?.length / itemsPerPage.value))

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
            'ring-4 ring-black': apiData.getParents.some(
              (p) => p.inscriptionId === pet.inscriptionId
            )
          }"
          @click="apiData.toggleParentSelection(pet)"
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
    <div v-if="authStore.isLoggedIn" class="flex justify-center mt-12">
      <button
        :class="currentPage > 1 ? 'visible' : 'invisible'"
        class="px-4 py-2 mx-1 bg-black text-white w-[100px]"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>
      <span v-if="totalPages > 1" class="px-4 py-2 mx-1 text-white">
        {{ currentPage }} / {{ totalPages }}
      </span>
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
