<script setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useModalStore } from '@/stores/modal.js'

const props = defineProps({
  modalId: {
    type: String,
    required: true
  }
})

const { modalId } = props

const modalStore = useModalStore()
</script>

<template>
  <TransitionRoot as="template" :show="modalStore.isOpen(modalId)">
    <Dialog class="relative z-10" @close="modalStore.closeModal(modalId)">
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
                  @click="modalStore.closeModal(modalId)"
                >
                  x
                </button>
              </div>
              <div class="sm:flex sm:items-start">
                <div
                  class="pt-6 mb-6 flex flex-col gap-y-6 text-center sm:ml-4 sm:mt-0 sm:text-left w-full"
                >
                  <slot />
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
