<script setup>
import { defineProps } from 'vue'
import { useModalStore } from '@/stores/modal.js'
import { useAuthStore } from '@/stores/auth.js'
import AppButton from '@/components/ui/AppButton.vue'

const modalStore = useModalStore()
const authStore = useAuthStore()

const props = defineProps({
  provider: {
    type: String,
    required: true
  },
  logoSrc: {
    type: String,
    required: true
  },
  logoAlt: {
    type: String,
    required: true
  },
  logoClass: {
    type: String,
    default: ''
  }
})

const login = async () => {
  await authStore.connectWallet(props.provider)
  modalStore.closeModal('login')
}
</script>

<template>
  <AppButton
    @click="login"
    :customClass="'flex items-center justify-center gap-x-3 border-4 border-black ring-4 ring-white w-[220px] mx-auto text-center p-2 cursor-pointer hover:scale-105 duration-200'"
  >
    <img :src="logoSrc" :alt="logoAlt" class="h-4 w-4" :class="logoClass" />
    <span>{{ provider }}</span>
  </AppButton>
</template>
