<script setup>
import AppLoader from '@/components/icons/AppLoader.vue'
import { useApiData } from '@/stores/apidata';
import { showToast } from '@/utils/toast';

const apiData = useApiData()

const props = defineProps({
  label: {
    type: String,
    required: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled && !props.isLoading) {
    if(apiData.fee > apiData.lowFee ){
      emits('click', event)
    } else{
      showToast(`fee should be greater than ${apiData.lowFee} sats`, 'error')
    }
  }
}
</script>

<template>
  <button
    :disabled="disabled || isLoading"
    @click="handleClick"
    :class="[
      'flex items-center justify-center gap-x-4 py-3 px-4 text-white text-[18px] h-[48px] min-w-[178px] border-4 border-black ring-4 ring-white hover:scale-105 duration-200 cursor-pointer',
      customClass,
      { 'bg-[#FF5400]': !customClass }
    ]"
  >
    <span>{{ label }}</span>
    <slot></slot>
    <AppLoader v-if="isLoading" />
  </button>
</template>
