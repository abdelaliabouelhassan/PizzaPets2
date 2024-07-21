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
    currentOrderId: '',
    fetching: false,
    orders: []
  }),
  getters: {
    getCurrentOrderId() {
      return this.currentOrderId
    },
    getOrders() {
      return this.orders
    },
    isFetching() {
      return this.fetching
    }
  },
  actions: {
    async createParentChildPsbt(order) {
      const fee = await getMempoolFeeSummary()

      const payload = {
        orderId: order.order_id,
        paymentAddress: order.payment_address,
        paymentPublicKey: order.payment_address_public_key,
        ordinalPublicKey: order.ordinal_address_public_key,
        feeRate: fee
      }

      const ordinalsbot = getOrdinalsbotInstance()
      const inscription = ordinalsbot.Inscription()

      try {
        const response = await inscription.createParentChildPsbt(payload)

        return response
      } catch (error) {
        console.error('Failed to create Parent Child PSBT:', error)
        showToast('Failed to create Parent Child PSBT', 'error')
      }
    },
    signPsbt(order, parentChildPsbt) {
      const authStore = useAuthStore()
      console.log('wallet Type', authStore.getWalletType)
      console.log('order:', order)
      console.log('parentChildPsbt:', parentChildPsbt)
    },
    createChildrenFilesPayload(files) {
      return files.map((data) => ({
        name: `${data}.txt`,
        type: 'plain/text',
        size: new TextEncoder().encode(data).length,
        dataURL: `data:plain/text;base64,${btoa(data)}`
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

        this.currentOrderId = response.id

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
      const parents = apiData.getParents
        .filter((data) => data.selected)
        .map((data) => ({
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
    toggleParentSelectionFromOrder(parent) {
      const apiData = useApiData()
      apiData.toggleParentSelection(parent)
    },
    toggleChildrenSelectionFromOrder(option) {
      const apiData = useApiData()
      apiData.toggleChildrenSelection(option)
    },
    findOrderById(orderId) {
      return this.orders.find((order) => order.order_id === orderId)
    },
    resetState() {
      this.orders = []
      this.currentOrderId = ''
      this.fetching = false
    }
  }
})
