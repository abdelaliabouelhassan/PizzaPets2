<template>
  <section class="w-full pt-20">
    <div class="mx-auto w-full max-w-[1170px] space-y-10 px-4">
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
              d="M11.5 23.5V20.5H14.5V14.5H11.5V11.5H14.5V8.5H17.5V20.5H20.5V23.5H11.5Z"
              fill="white"
            />
            <rect x="28" y="4" width="24" height="4" transform="rotate(-180 28 4)" fill="black" />
            <rect x="4" y="4" width="24" height="4" transform="rotate(90 4 4)" fill="black" />
            <rect x="32" y="4" width="24" height="4" transform="rotate(90 32 4)" fill="black" />
            <rect x="28" y="32" width="24" height="4" transform="rotate(-180 28 32)" fill="black" />
          </svg>
          <h2 class="text-[40px] text-white">Select your Pets</h2>
        </div>
        <button class="relative duration-300 hover:scale-110" @click="SelectAll">
          <div class="absolute left-0 top-0 h-[4px] w-full bg-black"></div>
          <div class="absolute -left-1 top-0 h-full w-[4px] py-1">
            <div class="h-full w-full bg-black"></div>
          </div>
          <div class="bg-[#FFE762] px-4 py-2 text-black">Select AlL</div>
          <div class="absolute bottom-0 left-0 h-[4px] w-full bg-black"></div>
          <div class="absolute -right-1 top-0 h-full w-[4px] py-1">
            <div class="h-full w-full bg-black"></div>
          </div>
        </button>
      </div>

      <div class="grid w-full grid-cols-5 gap-y-4 xl:grid-cols-6">
        <EggCard
          :image="item.image"
          v-for="(item, index, key) in Eggs"
          :key="key"
          :selected="selectedEgges.includes(index)"
          @click="SelectEgg(index)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import EggCard from './ui/EggCard.vue'
import { ref } from 'vue'

const selectedEgges = ref([])

const SelectEgg = (index) => {
  const selectedIndex = selectedEgges.value.indexOf(index)
  if (selectedIndex === -1) {
    selectedEgges.value.push(index)
  } else {
    selectedEgges.value.splice(selectedIndex, 1)
  }
}

const SelectAll = () => {
  if (selectedEgges.value.length === Eggs.value.length) {
    selectedEgges.value = []
  } else {
    selectedEgges.value = Eggs.value.map((_, index) => index)
  }
}

const Eggs = ref([
  {
    image: '/images/eggs/egg-1.png'
  },
  {
    image: '/images/eggs/egg-2.png'
  },
  {
    image: '/images/eggs/egg-3.png'
  },
  {
    image: '/images/eggs/egg-1.png'
  },
  {
    image: '/images/eggs/egg-1.png'
  },
  {
    image: '/images/eggs/egg-1.png'
  },
  {
    image: '/images/eggs/egg-2.png'
  },
  {
    image: '/images/eggs/egg-3.png'
  },
  {
    image: '/images/eggs/egg-1.png'
  },
  {
    image: '/images/eggs/egg-2.png'
  },
  {
    image: '/images/eggs/egg-3.png'
  },
  {
    image: '/images/eggs/egg-1.png'
  },
  {
    image: '/images/eggs/egg-2.png'
  },
  {
    image: '/images/eggs/egg-1.png'
  },
  {
    image: '/images/eggs/egg-2.png'
  },
  {
    image: '/images/eggs/egg-1.png'
  },
  {
    image: '/images/eggs/egg-3.png'
  },
  {
    image: '/images/eggs/egg-1.png'
  },
  {
    image: '/images/eggs/egg-2.png'
  },
  {
    image: '/images/eggs/egg-1.png'
  },
  {
    image: '/images/eggs/egg-3.png'
  },
  {
    image: '/images/eggs/egg-1.png'
  },
  {
    image: '/images/eggs/egg-1.png'
  },
  {
    image: '/images/eggs/egg-3.png'
  }
])
</script>
