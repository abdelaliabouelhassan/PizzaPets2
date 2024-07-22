import { showToast } from '@/utils/toast'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useApiData = defineStore('apiData', {
  state: () => ({
    delegates: [
      {
        label: 'Pizza',
        inscriptionId: '7eadd4b747543ba48e267f9c117dfcdcffe194260faceb9eba9f63937b692800i0',
        selected: false
      },
      {
        label: 'Shower',
        inscriptionId: '7eadd4b747543ba48e267f9c117dfcdcffe194260faceb9eba9f63937b692800i0',
        selected: false
      },
      {
        label: 'Milk',
        inscriptionId: '7eadd4b747543ba48e267f9c117dfcdcffe194260faceb9eba9f63937b692800i0',
        selected: false
      },
      {
        label: 'Coffee',
        inscriptionId: '7eadd4b747543ba48e267f9c117dfcdcffe194260faceb9eba9f63937b692800i0',
        selected: false
      },
      {
        label: 'Steroids',
        inscriptionId: '7eadd4b747543ba48e267f9c117dfcdcffe194260faceb9eba9f63937b692800i0',
        selected: false
      },
      {
        label: 'Weed',
        inscriptionId: '7eadd4b747543ba48e267f9c117dfcdcffe194260faceb9eba9f63937b692800i0',
        selected: false
      },
      {
        label: 'Cocaine',
        inscriptionId: '7eadd4b747543ba48e267f9c117dfcdcffe194260faceb9eba9f63937b692800i0',
        selected: false
      },
      {
        label: 'LSD',
        inscriptionId: '7eadd4b747543ba48e267f9c117dfcdcffe194260faceb9eba9f63937b692800i0',
        selected: false
      },
      {
        label: 'Beer',
        inscriptionId: '7eadd4b747543ba48e267f9c117dfcdcffe194260faceb9eba9f63937b692800i0',
        selected: false
      },
      {
        label: 'DMT',
        inscriptionId: '7eadd4b747543ba48e267f9c117dfcdcffe194260faceb9eba9f63937b692800i0',
        selected: false
      },
      {
        label: 'Ketamine',
        inscriptionId: '7eadd4b747543ba48e267f9c117dfcdcffe194260faceb9eba9f63937b692800i0',
        selected: false
      },
      {
        label: 'Molly',
        inscriptionId: '7eadd4b747543ba48e267f9c117dfcdcffe194260faceb9eba9f63937b692800i0',
        selected: false
      }
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
