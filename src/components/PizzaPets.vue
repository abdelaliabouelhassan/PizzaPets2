<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useApiData } from '@/stores/apidata'
import { useOrderStore } from '@/stores/order'
import AppButton from '@/components/ui/AppButton.vue'

const currentPage = ref(1)
const itemsPerPage = ref(8)
const authStore = useAuthStore()
const apiData = useApiData()
const orderStore = useOrderStore()

const getParents = computed(() => apiData.getParents)

const paginatedParents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return getParents.value?.slice(start, end)
})

const totalPages = computed(() => Math.ceil(getParents.value?.length / itemsPerPage.value))

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const isFirstButtonVisible = computed(() => currentPage.value > 1)
</script>

<template>
  <div class="m-4 max-w-[1140px]">
    <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      <div v-for="(parent, i) in paginatedParents" :key="i" class="relative">
        <div
          class="h-full duration-200 bg-gray-100 cursor-pointer group focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-gray-100 hover:scale-105"
          :class="{ 'ring-4 ring-black': parent.selected }"
          @click="orderStore.toggleParentSelectionFromOrder(parent)"
        >
          <img
            v-if="parent.contentType.startsWith('image/') && !parent.contentType.endsWith('svg+xml')"
            :src="`https://ordinals.com/content/${parent.inscriptionId}`"
            alt=""
            class="object-cover w-full h-full group-hover:opacity-75"
          />
          <iframe
            v-else-if="parent.contentType.endsWith('svg+xml')"
            :src="`https://ordinals.com/content/${parent.inscriptionId}`"
            class="w-full h-full border-none"
            frameborder="0"
          ></iframe>
          <video
            v-else-if="parent.contentType.startsWith('video/')"
            autoplay
            loop
            class="object-cover w-full h-full group-hover:opacity-75"
          >
            <source
              :src="`https://ordinals.com/content/${parent.inscriptionId}`"
              :type="parent.contentType"
            />
          </video>
          <iframe
            v-else-if="parent.contentType.startsWith('text/')"
            :src="`https://ordinals.com/content/${parent.inscriptionId}`"
            :title="`text ${i + 1}`"
            class="object-cover w-full h-full group-hover:opacity-75"
          ></iframe>
          <iframe
            v-else-if="parent.contentType.startsWith('text/html')"
            :src="`https://ordinals.com/content/${parent.inscriptionId}`"
            :title="`html ${i + 1}`"
            class="object-cover w-full h-full group-hover:opacity-75"
          ></iframe>
          <div v-else  :title="`text ${i + 1}`" class="object-cover w-full h-full group-hover:opacity-75">
            {{ parent.textContent }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="authStore.isLoggedIn" class="flex justify-center mt-12">
      <AppButton
        @click="goToPage(currentPage - 1)"
        :label="'Previous'"
        :customClass="`${isFirstButtonVisible ? 'visible' : 'invisible'} px-4 py-2 mx-1 bg-black text-white w-[100px]`"
      />
      <span v-if="totalPages > 1" class="px-4 py-2 mx-1 text-white">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <AppButton
        @click="goToPage(currentPage + 1)"
        :label="'Next'"
        :customClass="`${currentPage < totalPages ? 'visible' : 'invisible'} px-4 py-2 mx-1 bg-black text-white w-[100px]`"
      />
    </div>
  </div>
</template>
