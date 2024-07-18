<template>
  <TransitionRoot as="template" :show="modalStore.open">
    <Dialog class="relative z-10" @close="modalStore.closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden bg-[#FF5400] border-4 border-black ring-4 ring-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  class="text-white text-2xl focus:outline-none"
                  @click="modalStore.closeModal"
                >
                  x
                </button>
              </div>
              <div class="sm:flex sm:items-start">
                <div
                  class="pt-6 mb-6 flex flex-col gap-y-6 text-center sm:ml-4 sm:mt-0 sm:text-left w-full"
                >
                  <button
                    class="flex items-center justify-center gap-x-3 border-4 border-black ring-4 ring-white w-[220px] mx-auto text-center p-2 text-white cursor-pointer hover:scale-105 duration-200"
                    @click="authStore.connectWallet('MagicEden')"
                  >
                    <img src="../assets/images/magic-eden-logo.png" class="h-4 w-4" alt="" />
                    <span> Magic eden </span>
                  </button>
                  <button
                    class="flex items-center justify-center gap-x-3 border-4 border-black ring-4 ring-white w-[220px] mx-auto text-center p-2 text-white cursor-pointer hover:scale-105 duration-200"
                    @click="authStore.connectWallet('Xverse')"
                  >
                    <img src="../assets/images/xverse-logo.png" class="h-4 w-4 -ml-7" alt="" />
                    <span> XVERSE </span>
                  </button>
                  <button
                    class="flex items-center justify-center gap-x-3 border-4 border-black ring-4 ring-white w-[220px] mx-auto text-center p-2 text-white cursor-pointer hover:scale-105 duration-200"
                    @click="authStore.connectWallet('Unisat')"
                  >
                    <img src="../assets/images/unisat.svg" class="h-4 w-4 -ml-7" alt="" />
                    <span> Unisat </span>
                  </button>
                  <button
                    class="flex items-center justify-center gap-x-3 border-4 border-black ring-4 ring-white w-[220px] mx-auto text-center p-2 text-white cursor-pointer hover:scale-105 duration-200"
                    @click="authStore.connectWallet('Leather')"
                  >
                    <img src="../assets/images/leather.svg" class="h-4 w-4 -ml-5" alt="" />
                    <span> Leather </span>
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useModalStore } from '@/stores/modal.js'
import { useAuthStore } from '@/stores/auth.js'

const modalStore = useModalStore()
const authStore = useAuthStore()
</script>
