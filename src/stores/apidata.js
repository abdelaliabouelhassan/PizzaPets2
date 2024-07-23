import { showToast } from '@/utils/toast'
import axios from 'axios'
import { defineStore } from 'pinia'
import delegatesData from '../delegates/delegates.json' // Import the JSON data

export const useApiData = defineStore('apiData', {
  state: () => ({
    delegates: delegatesData.map((delegate) => ({ ...delegate, selected: false })),
    parents: [],
    fee: 0,
    lowFee: 0
  }),
  getters: {
    getDelegates: (state) => state.delegates,
    getParents: (state) => state.parents,
    selectedDelegates: (state) => state.delegates?.filter((delegate) => delegate.selected),
    selectedParents: (state) => state.parents?.filter((parent) => parent.selected)
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
      const foundOption = this.delegates.find((delegate) => delegate.label === option.label)
      if (foundOption) {
        foundOption.selected = !foundOption.selected
      }
    },
    resetState() {
      this.parents = []
      this.delegates = this.delegates.map((delegate) => ({ ...delegate, selected: false }))
    }
  }
})
