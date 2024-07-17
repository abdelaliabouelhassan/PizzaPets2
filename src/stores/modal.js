import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    open: false
  }),
  actions: {
    openModal() {
      this.open = true
    },
    closeModal() {
      this.open = false
    }
  }
})
