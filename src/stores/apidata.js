import { showToast } from '@/utils/toast'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useApiData = defineStore('apiData', {
  state: () => ({
    files: [],
    parents: [],
    pets: []
  }),
  actions: {
    // eslint-disable-next-line no-unused-vars
    async fetchPets(address) {
      try {
        const response = await axios.get(
          `${window.location.origin}/.netlify/functions/owned-inscriptions?address=tb1pk5uh44r9hk9z33ygpkrqcnupaw28q07xvg9eu7utv4wv3d3q58pqj859wl`
          // `${window.location.origin}/.netlify/functions/owned-inscriptions?address=${address}`
        )
        this.pets = response.data
      } catch (error) {
        console.error('Error fetching pets:', error)
        showToast('Error fetching pets', 'error')
      }
    },
    toggleSelection(pet) {
      const index = this.parents.findIndex((p) => p.inscriptionId === pet.inscriptionId)
      if (index !== -1) {
        this.parents = this.parents.filter((f) => f.inscriptionId !== pet.inscriptionId)
      } else {
        this.parents.push(pet)
      }
    }
  }
})
