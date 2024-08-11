<script setup>
import AppModal from './AppModal.vue'
import WalletButton from './WalletButton.vue'
import { useModalStore } from '@/stores/modal.js'
import { useAuthStore } from '@/stores/auth.js'
import { formatAddress } from '@/utils/formatAddress.js'
import AppButton from '@/components/ui/AppButton.vue'
const modalStore = useModalStore()
const authStore = useAuthStore()
</script>

<template>
  <div class="relative w-full">
    <div class="absolute left-0 top-0 w-full">
      <div class="h-[40px] w-full bg-[#FFE762]"></div>
      <div class="h-[40px] w-full bg-[#FFD255]"></div>
      <div class="h-[40px] w-full bg-[#FFBE46]"></div>
      <div class="h-[40px] w-full bg-[#FFA838]"></div>
      <div class="h-[40px] w-full bg-[#FF952B]"></div>
      <div class="h-[40px] w-full bg-[#FF7C1B]"></div>
      <div class="h-[40px] w-full bg-[#FF690F]"></div>
      <div class="h-[40px] w-full bg-[#FF5400]"></div>
    </div>
    <header
      class="relative z-20 mx-auto flex w-full max-w-[1170px] items-center justify-between space-x-10 px-4 pt-12"
    >
      <div>
        <img src="@/assets/logo.svg" class="h-full w-full" alt="" />
      </div>

      <div class="flex items-center gap-8">
        <a href="#" class="flex items-center gap-3 space-y-1 text-2xl text-[#0D0702]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 4L16 12H12L12 4L16 4Z" fill="black" />
            <path d="M12 4L12 12H4L4 4L12 4Z" fill="#30B61E" />
            <path d="M4 4L4 12H1.04907e-06L0 4L4 4Z" fill="black" />
            <path d="M12 4L4 4L4 0L12 3.49691e-07V4Z" fill="black" />
            <path d="M12 16L4 16L4 12L12 12V16Z" fill="black" />
          </svg>
          <span>Feed Pets</span>
        </a>
        <a
          href="#"
          class="flex items-center gap-3 space-y-1 text-2xl text-[#0D0702] text-opacity-50"
        >
          <span>MINT</span>
        </a>
        <a
          href="#"
          class="flex items-center gap-3 space-y-1 text-2xl text-[#0D0702] text-opacity-50"
        >
          <span>About Us</span>
        </a>
      </div>

      <AppButton
        :label="
          !authStore.isLoggedIn ? 'Connect wallet' : formatAddress(authStore.getPaymentAddress)
        "
        @click="!authStore.isLoggedIn ? modalStore.openModal('login') : authStore.signOut()"
      />
    </header>

    <AppModal modalId="login">
      <WalletButton
        provider="MagicEden"
        logoSrc="./images/magic-eden-logo.png"
        logoAlt="Magic Eden Logo"
      />
      <WalletButton
        provider="Xverse"
        logoSrc="./images/xverse-logo.png"
        logoAlt="Xverse Logo"
        logoClass="-ml-7"
      />
      <WalletButton
        provider="Unisat"
        logoSrc="./images/unisat.svg"
        logoAlt="Unisat Logo"
        logoClass="-ml-7"
      />
    </AppModal>
  </div>
</template>
