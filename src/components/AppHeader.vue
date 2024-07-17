<script setup>
import LoginModal from './LoginModal.vue'
import { useModalStore } from '@/stores/modal.js'

const modalStore = useModalStore()
</script>

<template>
  <header class="w-full flex items-center justify-between space-x-10">
    <div>
      <img src="../assets/logo.svg" class="w-full h-full" alt="" />
    </div>

    <div>
      <button
        @click="modalStore.openModal"
        class="py-3 px-4 bg-[#FF5400] text-white text-[18px] h-[48px] min-w-[178px] border-4 border-black ring-4 ring-white hover:scale-105 duration-200 mr-1 cursor-pointer flex items-center justify-center"
      >
        Connect wallet
      </button>
    </div>
  </header>

  <LoginModal />
</template>
