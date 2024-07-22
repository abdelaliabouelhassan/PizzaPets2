import { useApiData } from '@/stores/apidata'
import { useAuthStore } from '@/stores/auth'
import { useModalStore } from '@/stores/modal'
import { getMempoolFeeSummary } from '@/utils/getMempoolFeeSummary'
import { getOrdinalsbotInstance } from '@/utils/ordinalsBot'
import { supabase } from '@/utils/supabase'
import { showToast } from '@/utils/toast'
import { defineStore } from 'pinia'
import Wallet, {
  RpcErrorCode,
  BitcoinNetworkType,
  signTransaction,
  getProviders
} from 'sats-connect'

import axios from 'axios'

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
      const authStore = useAuthStore()
      const walletType = authStore.getWalletType.toLowerCase()
      const ordinalsbot = getOrdinalsbotInstance()
      const inscription = ordinalsbot.Inscription()
      const fee = await getMempoolFeeSummary()
      try {
        const payload = {
          orderId: order.order_id,
          userAddress: order.payment_address,
          userPublicKey: order.payment_address_public_key,
          userOrdinalPublicKey: order.ordinal_address_public_key,
          userOrdinalsAddress: order.ordinal_address,
          feeRate: fee
        }
        if (walletType == 'xverse') {
          return await inscription.createParentChildPsbt(payload)
        } else {
          const response = await axios.post(
            'https://api.ordinalsbot.com/create-parent-child-psbt',
            payload
          )
          return response.data
        }
      } catch (error) {
        console.error('Failed to create Parent Child PSBT:', error)
        showToast('Failed to create Parent Child PSBT', 'error')
      }
    },
    async signPsbt(order, parentChildPsbt) {
      const authStore = useAuthStore()
      const walletType = authStore.getWalletType.toLowerCase()
      const modalStore = useModalStore()
      const apiData = useApiData()
      try {
        console.log('order', order)
        console.log('parentChildPsbt', parentChildPsbt)
        console.log('walletType', walletType)
        const signedPsbt = await this.signPsbtByWalletType(walletType, parentChildPsbt)
        console.log('signedPsbt:', signedPsbt)

        if (signedPsbt) {
          const tx = await this.pushSignedPsbt(walletType, signedPsbt)
          this.txId = tx
        }
      } catch (error) {
        apiData.delegates?.forEach((delegate) => (delegate.selected = false))
        apiData.parents?.forEach((delegate) => (delegate.selected = false))
        modalStore.closeModal('order-summary')
        console.error('Failed to sign PSBT:', error)
        showToast('User rejected to sign', 'error')
      }
    },
    async signPsbtByWalletType(walletType, parentChildPsbt) {
      const authStore = useAuthStore()
      const modalStore = useModalStore()
      const apiData = useApiData()
      if (walletType === 'unisat') {
        const unisat = window.unisat
        return await unisat.signPsbt(parentChildPsbt.psbtBase64, {
          autoFinalized: true
        })
      } else if (walletType === 'xverse') {
        try {
          const response = await Wallet.request('signPsbt', {
            psbt: parentChildPsbt.psbtBase64,
            signInputs: {
              [authStore.getPaymentAddress]: parentChildPsbt.paymentInputIndices,
              [authStore.getOrdinalAddress]: parentChildPsbt.ordinalInputIndices
            },
            broadcast: true
          })
          if (response.status === 'success') {
            return response
          } else {
            if (response.error.code === RpcErrorCode.USER_REJECTION) {
              apiData.parents?.forEach((delegate) => (delegate.selected = false))
              apiData.delegates?.forEach((delegate) => (delegate.selected = false))
              modalStore.closeModal('order-summary')
              showToast('User rejected to sign', 'error')
              console.log(response.error)
            } else {
              console.log(response.error)
            }
          }
        } catch (err) {
          console.log(err)
        }
      } else if (walletType === 'magiceden') {
        try {
          const networkType =
            import.meta.env.VITE_NETWORK === 'testnet'
              ? BitcoinNetworkType.Testnet
              : BitcoinNetworkType.Mainnet
          const data = await signTransaction({
            provider: getProviders(),
            payload: {
              network: networkType,
              psbtBase64: parentChildPsbt.psbtBase64,
              broadcast: true,
              inputsToSign: [
                {
                  address: authStore.getPaymentAddress,
                  signingIndexes: parentChildPsbt.paymentInputIndices
                }
              ]
            },
            onFinish: (response) => {
              console.log('Bulk tx signing response:', response)
              return response
            },
            onCancel: () => {
              alert('Request canceled')
            }
          })
          console.log(data)
        } catch (err) {
          console.error(err)
        }
      }
    },
    async pushSignedPsbt(walletType, signedPsbt) {
      if (walletType === 'unisat') {
        const unisat = window.unisat
        return await unisat.pushPsbt(signedPsbt)
      } else if (walletType === 'xverse') {
        return "correct"
      }
    },
    createChildrenDelegatesPayload(delegates) {
      return delegates.map((file) => ({
        delegateId: file.inscriptionId,
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
      if (parents.length === 0) {
        showToast('Please select at least 1 parent', 'error')
        this.fetching = false
        return
      }

      if (apiData.selectedDelegates.length === 0) {
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
        const selectedDelegates = apiData.selectedDelegates
        const delegates = this.createChildrenDelegatesPayload(selectedDelegates)

        const fee = await getMempoolFeeSummary()
        const requestPayload = this.createRequestPayload(
          delegates,
          parents,
          fee,
          authStore.getOrdinalAddress
        )

        console.log('requestPayload', requestPayload)

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
    createRequestPayload(delegates, parents, fee, receiveAddress) {
      return {
        delegates,
        parents,
        receiveAddress,
        lowPostage: true,
        fee,
        webhookUrl: `https://feed.pets.pizza/.netlify/functions/webhook`,
        inscriptionIdPrefix: '00'
      }
    },
    async handleDirectOrderButtonClick() {
      const apiData = useApiData()
      console.log(apiData.selectedParents)

      const parents = apiData.selectedParents.map((data) => ({
        inscriptionId: data.inscriptionId,
        returnAddress: data.address,
        value: data.utxo.satoshi
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
