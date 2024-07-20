import { useApiData } from '@/stores/apidata'
import { useAuthStore } from '@/stores/auth'
import { useModalStore } from '@/stores/modal'
import { getMempoolFeeSummary } from '@/utils/getMempoolFeeSummary'
import { getOrdinalsbotInstance } from '@/utils/ordinalsBot'
import { supabase } from '@/utils/supabase'
import { showToast } from '@/utils/toast'
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orderId: '',
    fetching: false,
    orders: []
  }),
  getters: {
    getOrderId() {
      return this.orderId
    },
    getOrders() {
      return this.orders
    },
    isFetching() {
      return this.fetching
    }
  },
  actions: {
    createChildrenFilesPayload(files) {
      return files.map((data) => ({
        name: `${data.label}.txt`,
        type: 'plain/text',
        size: new TextEncoder().encode(data.label).length,
        dataURL: `data:plain/text;base64,${btoa(data.label)}`
      }))
    },
    async insertOrderToSupabase(response) {
      const authStore = useAuthStore()
      await supabase
        .from('orders')
        .insert({
          payment_address: authStore.getPaymentAddress,
          payment_address_public_key: authStore.getPaymentAddressPublicKey,
          ordinal_address: authStore.getOrdinalAddress,
          ordinal_address_public_key: authStore.getOrdinalAddressPublicKey,
          order_id: response.id,
          order_status: response.state,
          order_content: response
        })
        .select()
    },
    async sendInscription(parents) {
      const apiData = useApiData()
      const authStore = useAuthStore()
      const modalStore = useModalStore()

      if (this.fetching) return
      this.fetching = true
      if (apiData.getParents?.length === 0) {
        showToast('Please select parents', 'error')
        this.fetching = false
        return
      }
      if (apiData.getFiles?.length === 0) {
        showToast('Please select at least 1 option', 'error')
        this.fetching = false
        return
      }
      if (!authStore.getOrdinalAddress) {
        showToast('Please connect your wallet', 'error')
        this.fetching = false
        return
      }

      try {
        const files = this.createChildrenFilesPayload(apiData.getFiles)
        const fee = await getMempoolFeeSummary()

        const requestPayload = {
          files,
          parents,
          receiveAddress: authStore.getOrdinalAddress,
          lowPostage: true,
          fee: fee,
          webhookUrl: `https://feed.pets.pizza/.netlify/functions/webhook`
        }

        const ordinalsbot = getOrdinalsbotInstance()
        const inscription = ordinalsbot.Inscription()
        const response = await inscription.createDirectOrder(requestPayload)

        await this.insertOrderToSupabase(response)

        this.orderId = response.id

        modalStore.openModal('order-summary')

        this.fetching = false
        return true
      } catch (error) {
        this.fetching = false

        console.error('Something went wrong:', error)
        showToast('Something went wrong', 'error')
      }
    },
    async handleDirectOrderButtonClick() {
      const apiData = useApiData()
      const parents = apiData.getParents?.map((data) => ({
        inscriptionId: data.inscriptionId,
        returnAddress: data.address,
        value: data.outSatoshi
      }))
      await this.sendInscription(parents)
    },
    updateOrCreateOrder(order) {
      const index = this.orders.findIndex((o) => o.order_id === order.order_id)
      if (index !== -1) {
        this.orders[index] = order
      } else {
        this.orders.push(order)
      }
    },
    toggleParentSelectionFromOrder(pet) {
      const apiData = useApiData()
      apiData.toggleParentSelection(pet)
    },
    toggleChildrenSelectionFromOrder(option) {
      const apiData = useApiData()
      apiData.toggleChildrenSelection(option)
    }
  }
})
