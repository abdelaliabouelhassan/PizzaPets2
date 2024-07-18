import { defineStore } from 'pinia'
import { getAddress, BitcoinNetworkType, AddressPurpose } from 'sats-connect'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useModalStore } from './modal'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    walletAddress: localStorage.getItem('walletAddress') || ''
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
    },
    async connectWallet(walletType) {
      const getAddressOptions = this.getAddressOptions(walletType)

      try {
        await getAddress(getAddressOptions)
      } catch (err) {
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
        import.meta.VITE_NETWORK === 'testnet'
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
          modalStore.closeModal()
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
    }
  }
})
