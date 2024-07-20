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
  <header class="w-full flex items-center justify-between space-x-10 px-4">
    <div>
      <img src="@/assets/logo.svg" class="w-full h-full" alt="" />
    </div>

    <AppButton
      :label="!authStore.isLoggedIn ? 'Connect wallet' : formatAddress(authStore.getPaymentAddress)"
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
</template>
