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
    order: null,
    txId: null
  }),
  getters: {
    getCurrentOrderId: (state) => state.currentOrderId,
    getOrder: (state) => state.order,
    isFetching: (state) => state.fetching,
    getTxId: (state) => state.txId
  },
  actions: {
    async handleOrderUpdate(newOrder) {
      this.setOrder(newOrder)
      const parentChildPsbt = await this.createParentChildPsbt(newOrder)
      await this.signPsbt(newOrder, parentChildPsbt)
    },
    async createParentChildPsbt(order) {
      const ordinalsbot = getOrdinalsbotInstance()
      const inscription = ordinalsbot.Inscription()
      const fee = await getMempoolFeeSummary()

      try {
        const payload = {
          orderId: order.order_id,
          paymentAddress: order.payment_address,
          paymentPublicKey: order.payment_address_public_key,
          ordinalPublicKey: order.ordinal_address_public_key,
          feeRate: fee
        }
        return await inscription.createParentChildPsbt(payload)
      } catch (error) {
        console.error('Failed to create Parent Child PSBT:', error)
        showToast('Failed to create Parent Child PSBT', 'error')
      }
    },
    async signPsbt(order, parentChildPsbt) {
      const authStore = useAuthStore()
      const walletType = authStore.getWalletType.toLowerCase()

      console.log('order:', order)
      console.log('parentChildPsbt:', parentChildPsbt)
      console.log('wallet type:', walletType)

      try {
        const signedPsbt = await this.signPsbtByWalletType(walletType, parentChildPsbt)
        if (signedPsbt) {
          const tx = await this.pushSignedPsbt(walletType, signedPsbt)
          this.txId = tx
        }
      } catch (error) {
        console.error('Failed to sign PSBT:', error)
        showToast('Failed to sign PSBT', 'error')
      }
    },
    async signPsbtByWalletType(walletType, parentChildPsbt) {
      if (walletType === 'unisat') {
        const unisat = window.unisat
        return await unisat.signPsbt(parentChildPsbt.psbtBase64)
      } else {
        console.log('sign psbt', walletType)
        return null
      }
    },
    async pushSignedPsbt(walletType, signedPsbt) {
      if (walletType === 'unisat') {
        const unisat = window.unisat
        return await unisat.pushPsbt(signedPsbt)
      }
    },
    createChildrenFilesPayload(files) {
      return files.map((file) => ({
        name: `${file.label}.txt`,
        type: 'plain/text',
        size: new TextEncoder().encode(file.label).length,
        dataURL: `data:plain/text;base64,${btoa(file.label)}`
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
      if (apiData.selectedParents.length === 0) {
        showToast('Please select parents', 'error')
        this.fetching = false
        return
      }

      if (apiData.selectedFiles.length === 0) {
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
        const inscribeChildren = apiData.selectedFiles
        const files = this.createChildrenFilesPayload(inscribeChildren)
        const fee = await getMempoolFeeSummary()
        const requestPayload = this.createRequestPayload(
          files,
          parents,
          fee,
          authStore.getOrdinalAddress
        )
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
    createRequestPayload(files, parents, fee, receiveAddress) {
      return {
        files,
        parents,
        receiveAddress,
        lowPostage: true,
        fee,
        webhookUrl: `https://feed.pets.pizza/.netlify/functions/webhook`
      }
    },
    async handleDirectOrderButtonClick() {
      const apiData = useApiData()
      const parents = apiData.selectedParents.map((data) => ({
        inscriptionId: data.inscriptionId,
        returnAddress: data.address,
        value: data.outSatoshi
      }))
      await this.sendInscription(parents)
    },
    resetState() {
      this.order = null
      this.currentOrderId = ''
      this.fetching = false
      this.txId = null
    },
    setOrder(order) {
      this.order = order
    },
    toggleParentSelectionFromOrder(parent) {
      const apiData = useApiData()
      apiData.toggleParentSelection(parent)
    },
    toggleChildrenSelectionFromOrder(option) {
      const apiData = useApiData()
      apiData.toggleChildrenSelection(option)
    }
  }
})
