<template>
  <div class="mt-12 grid grid-cols-7 gap-4">
    <div
      v-for="(option, index) in options"
      :key="index"
      @click="toggleSelection(index)"
      :class="selected.includes(index) ? 'border-white' : 'border-transparent'"
      class="cursor-pointer p-4 shadow bg-black text-white border-4 hover:border-white flex items-center justify-center"
    >
      <span>{{ option.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const options = [
  { label: '🍕 Pizza' },
  { label: '🚿 Shower' },
  { label: '🥛 Milk' },
  { label: '☕ Coffee' },
  { label: '💉💪 Steroids' },
  { label: '🌿🚬 Weed' },
  { label: '👃🎱 Cocaine' },
  { label: '👅🌈 LSD' },
  { label: '🍺 Beer' },
  { label: '🍷🧀 Wine' },
  { label: '🍸🥩🥦🥔 Steak' },
  { label: '💉👽 DMT' },
  { label: '💉☮ Ketamine' },
  { label: '👅🍬 Molly' }
]

const selected = ref([])

const toggleSelection = (index) => {
  if (selected.value.includes(index)) {
    selected.value = selected.value.filter((i) => i !== index)
  } else {
    selected.value.push(index)
  }
}
</script>
