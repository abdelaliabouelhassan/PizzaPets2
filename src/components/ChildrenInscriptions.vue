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
  <div class="mx-auto mt-12 w-full max-w-[1170px] space-y-8 px-4">
    <div class="flex w-full items-center justify-between">
      <div class="flex items-center gap-4 space-y-1">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="32" height="32" transform="matrix(-1 0 0 -1 32 32)" fill="#FF5400" />
          <path
            d="M11.5 23.5V14.5H17.5V11.5H11.5V8.5H20.5V17.5H14.5V20.5H20.5V23.5H11.5Z"
            fill="white"
          />
          <rect x="28" y="4" width="24" height="4" transform="rotate(-180 28 4)" fill="black" />
          <rect x="4" y="4" width="24" height="4" transform="rotate(90 4 4)" fill="black" />
          <rect x="32" y="4" width="24" height="4" transform="rotate(90 32 4)" fill="black" />
          <rect x="28" y="32" width="24" height="4" transform="rotate(-180 28 32)" fill="black" />
        </svg>

        <h2 class="text-[40px] text-white">Feed your Pets</h2>
      </div>
    </div>
    <div class="grid w-full grid-cols-2 gap-4 lg:grid-cols-6">
      <div
        v-for="(option, index) in apiData.getDelegates"
        :key="index"
        @click="toggleChildrenSelection(option)"
        :class="option.selected ? 'border-white' : 'border-transparent'"
        class="relative flex cursor-pointer flex-col items-center justify-center border-4 bg-black p-4 text-white shadow hover:border-white"
      >
        <div class="absolute -right-2 -top-4" v-if="option.selected">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="path-1-inside-1_88_6646" fill="white">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M28 0H4V4H0V28H4V32H28V28H32V4H28V0Z"
              />
            </mask>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M28 0H4V4H0V28H4V32H28V28H32V4H28V0Z"
              fill="#30B61E"
            />
            <path
              d="M4 0V-4H0V0H4ZM28 0H32V-4H28V0ZM4 4V8H8V4H4ZM0 4V0H-4V4H0ZM0 28H-4V32H0V28ZM4 28H8V24H4V28ZM4 32H0V36H4V32ZM28 32V36H32V32H28ZM28 28V24H24V28H28ZM32 28V32H36V28H32ZM32 4H36V0H32V4ZM28 4H24V8H28V4ZM4 4H28V-4H4V4ZM8 4V0H0V4H8ZM0 8H4V0H0V8ZM4 28V4H-4V28H4ZM4 24H0V32H4V24ZM8 32V28H0V32H8ZM28 28H4V36H28V28ZM24 28V32H32V28H24ZM32 24H28V32H32V24ZM28 4V28H36V4H28ZM28 8H32V0H28V8ZM24 0V4H32V0H24Z"
              fill="black"
              mask="url(#path-1-inside-1_88_6646)"
            />
            <rect x="8" y="14" width="4" height="4" fill="#FFFAFE" />
            <rect x="12" y="18" width="4" height="4" fill="#FFFAFE" />
            <rect x="16" y="14" width="4" height="4" fill="#FFFAFE" />
            <rect x="20" y="10" width="4" height="4" fill="#FFFAFE" />
          </svg>
        </div>
        <img :src="getIconPath(option.label)" class="mb-2 h-6 w-6" alt="" />
        <span class="text-lg">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>
