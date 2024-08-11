<script setup>
import { ref } from 'vue'
const selectedIndex = ref(null)

const SelectFee = (index) => {
  if (selectedIndex.value === index) {
    selectedIndex.value = null
    return
  }
  selectedIndex.value = index
}
</script>

<template>
  <div class="mx-auto mt-12 max-w-[1170px] space-y-8 px-4 text-white">
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
            d="M11.5 23.5V20.5H17.5V17.5H14.5V14.5H17.5V11.5H11.5V8.5H20.5V23.5H11.5Z"
            fill="white"
          />
          <rect x="28" y="4" width="24" height="4" transform="rotate(-180 28 4)" fill="black" />
          <rect x="4" y="4" width="24" height="4" transform="rotate(90 4 4)" fill="black" />
          <rect x="32" y="4" width="24" height="4" transform="rotate(90 32 4)" fill="black" />
          <rect x="28" y="32" width="24" height="4" transform="rotate(-180 28 32)" fill="black" />
        </svg>

        <h2 class="text-[40px] text-white">Select Fee and Confirm</h2>
      </div>
    </div>
    <div class="mt-4 grid grid-cols-3 gap-6">
      <div
        @click="SelectFee(0)"
        :class="{ 'border-white': selectedIndex === 0 }"
        class="relative cursor-pointer border-4 border-black bg-black py-4 text-center duration-200 hover:border-white"
      >
        <div class="absolute -right-3 -top-2" v-if="selectedIndex === 0">
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
        <div class="text-2xl text-white text-opacity-75">Medium priority</div>
        <div class="text-lg text-white text-opacity-55">1 SATS / UBYTE</div>
      </div>
      <div
        @click="SelectFee(1)"
        :class="{ 'border-white': selectedIndex === 1 }"
        class="relative cursor-pointer border-4 border-black bg-black py-4 text-center duration-200 hover:border-white"
      >
        <div class="absolute -right-3 -top-2" v-if="selectedIndex === 1">
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
        <div class="text-2xl text-white text-opacity-75">High Priority</div>
        <div class="text-lg text-white text-opacity-55">3.5 SATS / UBYTE</div>
      </div>
      <div
        @click="SelectFee(2)"
        :class="{ 'border-white': selectedIndex === 2 }"
        class="relative cursor-pointer border-4 border-black bg-black py-4 text-center duration-200 hover:border-white"
      >
        <div class="absolute -right-3 -top-2" v-if="selectedIndex === 2">
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
        <div class="text-2xl text-white text-opacity-75">Custom</div>
        <div class="text-lg text-white text-opacity-55">Manual Setting</div>
      </div>
    </div>

    <div class="w-full space-y-4 bg-black p-8">
      <div class="flex w-full items-center justify-between">
        <span class="text-lg text-white">Inscription Sats:</span>
        <div class="space-x-2">
          <span class="text-lg text-white">1 x 546 sats</span>
          <span class="text-lg text-white text-opacity-75">~ $0.30</span>
        </div>
      </div>
      <div class="flex w-full items-center justify-between">
        <span class="text-lg text-white">Network Fee:</span>
        <div class="space-x-2">
          <span class="text-lg text-white">110871 sats</span>
          <span class="text-lg text-white text-opacity-75">~ $61.87</span>
        </div>
      </div>
      <div class="flex w-full items-center justify-between">
        <span class="text-lg text-white">Size Fee:</span>
        <div class="space-x-2">
          <span class="text-lg text-white">11087 sats</span>
          <span class="text-lg text-white text-opacity-75">~ $6.19</span>
        </div>
      </div>
      <div class="flex w-full items-center justify-between">
        <span class="text-lg text-white">Service Fee:</span>
        <div class="space-x-2">
          <span class="text-lg text-white">1 x 9000 satS</span>
          <span class="text-lg text-white text-opacity-75">~ $5.02</span>
        </div>
      </div>
    </div>

    <div class="border-4 border-black bg-[#FFE762] px-6 py-4 ring-4 ring-white">
      <div class="flex w-full items-center justify-between">
        <span class="text-lg text-black">Confirm and PaY</span>
        <div class="space-x-2">
          <span class="text-lg text-black">131504 sats</span>
          <span class="text-lg text-black text-opacity-50">~ $73.38</span>
        </div>
      </div>
    </div>
  </div>
</template>
