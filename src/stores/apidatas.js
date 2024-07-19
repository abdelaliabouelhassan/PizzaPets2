import { defineStore } from 'pinia'

export const useApiData = defineStore('apiData', {
    state: () => ({
        files: []
    }),
})
