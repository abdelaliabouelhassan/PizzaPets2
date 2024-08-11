<template>
  <div class="relative">
    <div class="absolute -top-2 right-2" v-if="selected">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="path-1-inside-1_88_6646" fill="white">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M28 0H4V4H0V28H4V32H28V28H32V4H28V0Z" />
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
    <div
      class="h-[170px] w-full max-w-[170px] cursor-pointer border-[8px] duration-200 hover:border-white"
      :class="{ 'border-white': selected, 'border-black': !selected }"
    >
      <img :src="image" class="h-full w-full object-cover" alt="" />
    </div>
  </div>
</template>

<script setup>
defineProps(['image', 'selected'])
</script>
