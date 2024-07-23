import { useApiData } from '@/stores/apidata'
import { useAuthStore } from '@/stores/auth'
import { useModalStore } from '@/stores/modal'
import { getMempoolFeeSummary } from '@/utils/getMempoolFeeSummary'
import { getOrdinalsbotInstance } from '@/utils/ordinalsBot'
import { supabase } from '@/utils/supabase'
import { showToast } from '@/utils/toast'
import axios from 'axios'
import { Psbt, initEccLib } from 'bitcoinjs-lib'
import { defineStore } from 'pinia'
import Wallet, { BitcoinNetworkType, signTransaction } from 'sats-connect'
import * as ecc from 'tiny-secp256k1'

initEccLib(ecc)

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
      if (newOrder.order_status === 'waiting-parent') {
        const parentChildPsbt = await this.createParentChildPsbt(newOrder)
        await this.signPsbt(parentChildPsbt)
      }
    },
    async createParentChildPsbt(order) {
      const authStore = useAuthStore()
      const walletType = authStore.getWalletType.toLowerCase()
      const ordinalsbot = getOrdinalsbotInstance()
      const inscription = ordinalsbot.Inscription()
      const fee = await getMempoolFeeSummary()

      const payload = {
        orderId: order.order_id,
        userAddress: order.payment_address,
        userPublicKey: order.payment_address_public_key,
        userOrdinalPublicKey: order.ordinal_address_public_key,
        userOrdinalsAddress: order.ordinal_address,
        feeRate: fee
      }

      try {
        if (walletType === 'xverse') {
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
    async signPsbt(parentChildPsbt) {
      const authStore = useAuthStore()
      const walletType = authStore.getWalletType.toLowerCase()

      try {
        const txId = await this.signPsbtByWalletType(walletType, parentChildPsbt)
        this.txId = txId
      } catch (error) {
        console.error('Failed to sign PSBT:', error)
      }
    },
    async signPsbtByWalletType(walletType, parentChildPsbt) {
      const modalStore = useModalStore()
      const apiData = useApiData()

      try {
        switch (walletType) {
          case 'unisat':
            return await this.signPsbtWithUnisat(parentChildPsbt)
          case 'xverse':
            return await this.signPsbtWithXverse(parentChildPsbt)
          case 'magiceden':
            return await this.signPsbtWithMagicEden(parentChildPsbt)
          default:
            throw new Error('Unsupported wallet type')
        }
      } catch (error) {
        apiData.delegates?.forEach((delegate) => (delegate.selected = false))
        apiData.parents?.forEach((delegate) => (delegate.selected = false))
        modalStore.closeModal('order-summary')
        showToast('User rejected to sign PSBT', 'error')
        throw error
      }
    },
    async signPsbtWithUnisat(parentChildPsbt) {
      const unisat = window.unisat

      try {
        const signedPsbt = await unisat.signPsbt(parentChildPsbt.psbtBase64, {
          autoFinalized: true
        })
        return await unisat.pushPsbt(signedPsbt)
      } catch (error) {
        console.error('Failed to sign PSBT with Unisat:', error)
        throw error
      }
    },
    async signPsbtWithXverse(parentChildPsbt) {
      const authStore = useAuthStore()

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
          return response.result.txid
        } else {
          throw new Error(response.error.message || 'Unknown error')
        }
      } catch (error) {
        console.error('Failed to sign PSBT with Xverse:', error)
        throw error
      }
    },
    async signPsbtWithMagicEden(parentChildPsbt) {
      const authStore = useAuthStore()
      const networkType =
        import.meta.env.VITE_NETWORK === 'testnet'
          ? BitcoinNetworkType.Testnet
          : BitcoinNetworkType.Mainnet

      return new Promise((resolve, reject) =>
        signTransaction({
          getProvider: async () => window.magicEden?.bitcoin,
          payload: {
            network: { type: networkType },
            psbtBase64: parentChildPsbt.psbtBase64,
            broadcast: false,
            inputsToSign: [
              {
                address: authStore.getPaymentAddress,
                signingIndexes: parentChildPsbt.paymentInputIndices
              },
              {
                address: authStore.getOrdinalAddress,
                signingIndexes: parentChildPsbt.ordinalInputIndices
              }
            ]
          },
          onFinish: async (response) => {
            try {
              const psbt = Psbt.fromBase64(response.psbtBase64)
              psbt.finalizeAllInputs()
              const signedTx = psbt.extractTransaction()
              const rawTx = signedTx.toHex()
              const txid = await this.broadcastTransaction(rawTx)
              resolve(txid)
            } catch (error) {
              console.error('Failed to finalize and broadcast transaction:', error)
              reject(error)
            }
          },
          onCancel: (error) => {
            console.error('User canceled transaction signing:', error)
            reject('User canceled transaction signing')
          }
        })
      )
    },
    async broadcastTransaction(rawTx) {
      try {
        const response = await axios.post('https://mempool.space/api/tx', rawTx, {
          headers: { 'Content-Type': 'text/plain' }
        })
        return response.data
      } catch (error) {
        console.error('Failed to broadcast transaction:', error)
        throw new Error('Failed to broadcast transaction')
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

      try {
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
      } catch (error) {
        console.error('Failed to insert order to Supabase:', error)
      }
    },
    async sendInscription(parents) {
      const apiData = useApiData()
      const authStore = useAuthStore()
      const modalStore = useModalStore()

      if (this.fetching) return

      this.fetching = true

      if (!parents.length) {
        showToast('Please select at least 1 parent', 'error')
        this.fetching = false
        return
      }

      if (!apiData.selectedDelegates.length) {
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
        const delegates = this.createChildrenDelegatesPayload(apiData.selectedDelegates)
        const fee = await getMempoolFeeSummary()
        const requestPayload = this.createRequestPayload(
          delegates,
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
        console.error('Something went wrong:', error)
        showToast('Something went wrong', 'error')
        this.fetching = false
      }
    },
    createRequestPayload(delegates, parents, fee, receiveAddress) {
      return {
        delegates,
        parents,
        receiveAddress,
        lowPostage: true,
        fee,
        webhookUrl: 'https://feed.pets.pizza/.netlify/functions/webhook',
        inscriptionIdPrefix: '00'
      }
    },
    async handleDirectOrderButtonClick() {
      const apiData = useApiData()
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
