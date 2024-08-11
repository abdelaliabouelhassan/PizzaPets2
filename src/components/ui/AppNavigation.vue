<template>
  <div class="w-full -space-y-1.5 pt-40">
    <div class="mx-auto max-w-[1170px] px-4">
      <div class="flex w-full items-center justify-between">
        <div
          class="w-full border-white pb-8 text-center"
          :class="{ 'border-b-[6px]': Active === 0 }"
        >
          <button
            class="text-[32px] text-white"
            :class="{ 'text-opacity-75': Active != 0 }"
            @click="changeActive(0)"
          >
            Feed Pets
          </button>
        </div>
        <div
          class="w-full border-white pb-8 text-center"
          :class="{ 'border-b-[6px]': Active === 1 }"
        >
          <button
            class="text-[32px] text-white"
            :class="{ 'text-opacity-75': Active != 1 }"
            @click="changeActive(1)"
          >
            Breeding Pets
          </button>
        </div>
        <div
          class="w-full border-white pb-8 text-center"
          :class="{ 'border-b-[6px]': Active === 2 }"
        >
          <button
            class="text-[32px] text-white"
            :class="{ 'text-opacity-75': Active != 2 }"
            @click="changeActive(2)"
          >
            Device
          </button>
        </div>
      </div>
    </div>

    <div class="relative w-full">
      <div class="h-[6px] w-full bg-white bg-opacity-25"></div>
      <div class="absolute right-40 top-0 h-[6px] w-[20px] bg-[#FF5400]"></div>
      <div class="absolute -top-1.5 right-40 h-[6px] w-[20px] bg-white bg-opacity-25"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const Active = ref(0)

const changeActive = (index) => {
  Active.value = index
}
</script>
