import realtime from '@/utils/realtime'
import { Ordinalsbot } from 'ordinalsbot'
import { defineStore } from 'pinia'
import { AddressPurpose, BitcoinNetworkType, getAddress } from 'sats-connect'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useModalStore } from './modal'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    walletAddress: localStorage.getItem('walletAddress') || '',
    channel: null
  }),
  getters: {
    isLoggedIn() {
      return this.walletAddress !== ''
    }
  },
  actions: {
    signOut() {
      this.walletAddress = ''
      localStorage.removeItem('walletAddress')
      localStorage.removeItem('walletType')
      if (this.channel) {
        this.channel.unsubscribe()
        this.channel = null
      }
      toast.success(`Wallet Disconnected`, {
        theme: 'colored',
        autoClose: 3000,
        position: 'bottom-right'
      })
    },
    async connectWallet(walletType) {
      const modalStore = useModalStore()

      try {
        if (walletType == 'Unisat') {
          const unisat = window.unisat
          let network = await unisat.getNetwork()
          if (network === 'livenet' && import.meta.env.VITE_NETWORK === 'testnet') {
            await unisat.switchNetwork('testnet')
          }
          if (network === 'testnet' && import.meta.env.VITE_NETWORK === 'mainnet') {
            await unisat.switchNetwork('livenet')
          }
          const addresses = await unisat.requestAccounts()
          localStorage.setItem('walletType', walletType)
          localStorage.setItem('walletAddress', addresses[0])
          this.walletAddress = addresses[0]
          this.connectWebSocket()
          modalStore.closeModal()
          toast.success(`${walletType} Wallet Connected`, {
            theme: 'colored',
            autoClose: 3000,
            position: 'bottom-right'
          })
        } else if (walletType == 'Leather') {
          const addressesRes = await window.btc.request('getAddresses', {})
          const address = addressesRes.result.addresses.find((address) => address.type === 'p2tr')
          localStorage.setItem('walletType', walletType)
          localStorage.setItem('walletAddress', address.address)
          this.walletAddress = address.address
          this.connectWebSocket()
          modalStore.closeModal()
          toast.success(`${walletType} Wallet Connected`, {
            theme: 'colored',
            autoClose: 3000,
            position: 'bottom-right'
          })
        } else {
          const getAddressOptions = this.getAddressOptions(walletType)
          await getAddress(getAddressOptions)
        }
      } catch (err) {
        console.log(err)
        toast.error(`Install ${walletType} Wallet`, {
          theme: 'colored',
          autoClose: 3000,
          position: 'bottom-right'
        })
      }
    },
    getAddressOptions(walletType) {
      const modalStore = useModalStore()

      const networkType =
        import.meta.env.VITE_NETWORK === 'testnet'
          ? BitcoinNetworkType.Testnet
          : BitcoinNetworkType.Mainnet

      const options = {
        payload: {
          purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
          message: 'Address for receiving Ordinals and payments',
          network: {
            type: networkType
          }
        },
        onFinish: (response) => {
          const address = response.addresses[0].address
          localStorage.setItem('walletType', walletType)
          localStorage.setItem('walletAddress', address)
          this.walletAddress = address
          this.connectWebSocket()
          modalStore.closeModal()
          toast.success(`${walletType} Wallet Connected`, {
            theme: 'colored',
            autoClose: 3000,
            position: 'bottom-right'
          })
        },
        onCancel: () => {
          toast.error('Request canceled', {
            theme: 'colored',
            autoClose: 3000,
            position: 'bottom-right'
          })
        }
      }

      if (walletType === 'MagicEden') {
        options.getProvider = async () => window.magicEden?.bitcoin
      }

      return options
    },
    connectWebSocket() {
      this.channel = realtime
        .channel('orders-channel')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders' },
          async (payload) => {
            if (payload.new.order_status === 'waiting-parent') {
              const ordinalsbotObj = new Ordinalsbot('', import.meta.env.VITE_NETWORK)
              const inscription = ordinalsbotObj.Inscription()
              const params = {
                orderId: payload.new.order_id, // The ID of the order for which to create the PSBT.
                paymentAddress: payload.new.user_address,
                paymentPublicKey: payload.new.user_address,
                ordinalPublicKey: payload.new.user_address,
                feeRate: 10
              }
              console.log('createParentChildPsbt params:', params)
              const response = await inscription.createParentChildPsbt(params)
              console.log('response', response)
            }
          }
        )
        .subscribe()
    }
  }
})
