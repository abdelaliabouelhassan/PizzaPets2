<script setup>
import LoginModal from './LoginModal.vue'
</script>

<template>
  <header class="w-full flex items-center justify-between space-x-10">
    <div>
      <img src="../assets/logo.svg" class="w-full h-full" alt="" />
    </div>

    <div>
      <a
        class="py-3 px-4 bg-[#FF5400] text-white text-[18px] h-[48px] min-w-[178px] border-4 border-black ring-4 ring-white hover:scale-105 duration-200 mr-1 cursor-pointer"
      >
        Connect wallet
      </a>
    </div>
  </header>

  <LoginModal />
</template>
