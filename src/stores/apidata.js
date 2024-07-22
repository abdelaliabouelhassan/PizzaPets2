import { showToast } from '@/utils/toast'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useApiData = defineStore('apiData', {
  state: () => ({
    delegates: [
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
    getDelegates: (state) => state.delegates,
    getParents: (state) => state.parents,
    selectedDelegates: (state) => state.delegates.filter((file) => file.selected),
    selectedParents: (state) => state.parents.filter((parent) => parent.selected)
  },
  actions: {
    async fetchParents(address) {
      try {
        const { data } = await axios.get(
          `${window.location.origin}/.netlify/functions/owned-inscriptions?address=${address}`
        )
        console.log({ data })
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
      const foundOption = this.delegates.find((file) => file.label === option.label)
      if (foundOption) {
        foundOption.selected = !foundOption.selected
      }
    },
    resetState() {
      this.delegates = this.delegates.map((file) => ({ ...file, selected: false }))
      this.parents = []
    }
  }
})
