<script setup>
import LoginModal from './LoginModal.vue'
import { useModalStore } from '@/stores/modal.js'
import { useAuthStore } from '@/stores/auth.js'
import { addressShortening } from '@/utils/address.js'

const modalStore = useModalStore()
const authStore = useAuthStore()
</script>

<template>
  <header class="w-full flex items-center justify-between space-x-10 px-4">
    <div>
      <img src="../assets/logo.svg" class="w-full h-full" alt="" />
    </div>

    <button
      @click="!authStore.isLoggedIn ? modalStore.openModal() : authStore.signOut()"
      class="py-3 px-4 bg-[#FF5400] text-white text-[18px] h-[48px] min-w-[178px] border-4 border-black ring-4 ring-white hover:scale-105 duration-200 mr-1 cursor-pointer flex items-center justify-center"
    >
      {{ !authStore.isLoggedIn ? 'Connect wallet' : addressShortening(authStore.walletAddress) }}
    </button>
  </header>

  <LoginModal />
</template>
