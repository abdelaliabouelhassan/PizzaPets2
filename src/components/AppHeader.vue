<script setup>
import AppModal from './AppModal.vue'
import { useModalStore } from '@/stores/modal.js'
import { useAuthStore } from '@/stores/auth.js'
import { formatAddress } from '@/utils/address.js'

const modalStore = useModalStore()
const authStore = useAuthStore()

const login = async (provider) => {
  await authStore.connectWallet(provider)
  modalStore.closeModal()
}
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
      {{ !authStore.isLoggedIn ? 'Connect wallet' : formatAddress(authStore.getPaymentAddress) }}
    </button>
  </header>

  <AppModal>
    <button
      class="flex items-center justify-center gap-x-3 border-4 border-black ring-4 ring-white w-[220px] mx-auto text-center p-2 text-white cursor-pointer hover:scale-105 duration-200"
      @click="login('MagicEden')"
    >
      <img src="../assets/images/magic-eden-logo.png" class="h-4 w-4" alt="" />
      <span> Magic eden </span>
    </button>
    <button
      class="flex items-center justify-center gap-x-3 border-4 border-black ring-4 ring-white w-[220px] mx-auto text-center p-2 text-white cursor-pointer hover:scale-105 duration-200"
      @click="login('Xverse')"
    >
      <img src="../assets/images/xverse-logo.png" class="h-4 w-4 -ml-7" alt="" />
      <span> XVERSE </span>
    </button>
    <button
      class="flex items-center justify-center gap-x-3 border-4 border-black ring-4 ring-white w-[220px] mx-auto text-center p-2 text-white cursor-pointer hover:scale-105 duration-200"
      @click="login('Unisat')"
    >
      <img src="../assets/images/unisat.svg" class="h-4 w-4 -ml-7" alt="" />
      <span> Unisat </span>
    </button>
  </AppModal>
</template>
