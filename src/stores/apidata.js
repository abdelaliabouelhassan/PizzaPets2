import { showToast } from '@/utils/toast'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useApiData = defineStore('apiData', {
  state: () => ({
    files: [
      { label: 'Pizza', selected: false },
      { label: 'Shower', selected: false },
      { label: 'Milk', selected: false },
      { label: 'Coffee', selected: false },
      { label: 'Steroids', selected: false },
      { label: 'Weed', selected: false },
      { label: 'Cocaine', selected: false },
      { label: 'LSD', selected: false },
      { label: 'Beer', selected: false },
      { label: 'DMT', selected: false },
      { label: 'Ketamine', selected: false },
      { label: 'Molly', selected: false }
    ],
    parents: []
  }),
  getters: {
    getFiles: (state) => state.files,
    getParents: (state) => state.parents,
    selectedFiles: (state) => state.files.filter((file) => file.selected),
    selectedParents: (state) => state.parents
  },
  actions: {
    async fetchParents(address) {
      try {
        const { data } = await axios.get(
          `${window.location.origin}/.netlify/functions/owned-inscriptions?address=${address}`
        )
        this.parents = data.map((parent) => ({ ...parent, selected: false }))
      } catch (error) {
        console.error('Error fetching pets:', error)
        showToast('Error fetching pets', 'error')
      }
    },
    toggleParentSelection(parent) {
      const foundParent = this.parents.find((p) => p.inscriptionId === parent.inscriptionId)
      if (foundParent) {
        foundParent.selected = !foundParent.selected
      }
    },
    toggleChildrenSelection(option) {
      const foundOption = this.files.find((file) => file.label === option.label)
      if (foundOption) {
        foundOption.selected = !foundOption.selected
      }
    },
    resetState() {
      this.files = this.files.map((file) => ({ ...file, selected: false }))
      this.parents = []
    }
  }
})
