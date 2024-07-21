import { showToast } from '@/utils/toast'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useApiData = defineStore('apiData', {
  state: () => ({
    files: [],
    parents: [],
    options: [
      { label: 'Pizza' },
      { label: 'Shower' },
      { label: 'Milk' },
      { label: 'Coffee' },
      { label: 'Steroids' },
      { label: 'Weed' },
      { label: 'Cocaine' },
      { label: 'LSD' },
      { label: 'Beer' },
      { label: 'DMT' },
      { label: 'Ketamine' },
      { label: 'Molly' }
    ]
  }),
  getters: {
    getFiles: (state) => state.files,
    getParents: (state) => state.parents,
    getOptions: (state) => state.options,
    selectedParents: (state) => state.parents.filter((parent) => parent.selected)
  },
  actions: {
    async fetchParents(address) {
      try {
        const { data } = await axios.get(
          // `${window.location.origin}/.netlify/functions/owned-inscriptions?address=tb1pk5uh44r9hk9z33ygpkrqcnupaw28q07xvg9eu7utv4wv3d3q58pqj859wl`
          `${window.location.origin}/.netlify/functions/owned-inscriptions?address=${address}`
        )
        this.parents = data.map((parent) => ({ ...parent, selected: false }))
      } catch (error) {
        console.error('Error fetching pets:', error)
        showToast('Error fetching pets', 'error')
      }
    },
    toggleParentSelection(pet) {
      const parent = this.parents.find((p) => p.inscriptionId === pet.inscriptionId)
      if (parent) {
        parent.selected = !parent.selected
      }
    },
    toggleChildrenSelection(option) {
      const index = this.files.indexOf(option)
      if (index !== -1) {
        this.files = this.files.filter((file) => file !== option)
      } else {
        this.files.push(option)
      }
    }
  }
})
