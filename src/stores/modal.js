import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    modals: {}
  }),
  actions: {
    openModal(modalId) {
      this.modals[modalId] = true
    },
    closeModal(modalId) {
      this.modals[modalId] = false
    },
    isOpen(modalId) {
      return this.modals[modalId] || false
    }
  }
})
