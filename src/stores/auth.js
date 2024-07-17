import { defineStore } from 'pinia'
import { getAddress, BitcoinNetworkType, AddressPurpose } from 'sats-connect'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useModalStore } from './modal'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    logoutOpen: false,
    walletAddress: localStorage.getItem('walletAddress') || ''
  }),
  actions: {
    openLogout() {
      this.logoutOpen = !this.logoutOpen
    },
    signOut() {
      this.walletAddress = ''
      this.logoutOpen = false
      localStorage.setItem('walletAddress', '')
      localStorage.setItem('walletType', '')
    },
    async WalletConnect(walletType) {
      const modalStore = useModalStore()

      if (walletType === 'Xverse') {
        try {
          const getAddressOptions = {
            payload: {
              purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
              message: 'Address for receiving Ordinals',
              network: {
                type: BitcoinNetworkType.Mainnet
              }
            },
            onFinish: (response) => {
              const address = response.addresses[0].address
              const paymentAddress = response.addresses[1].address
              const pubkey = response.addresses[0].publicKey
              const paymentPubkey = response.addresses[1].publicKey
              localStorage.setItem('walletType', walletType)
              localStorage.setItem('walletAddress', address)
              this.walletAddress = address
              modalStore.closeModal()
              toast.success('Xverse Wallet connected', {
                theme: 'colored',
                autoClose: 1000
              })
            },
            onCancel: () => {
              toast.warn('Request canceled', {
                theme: 'colored',
                autoClose: 1000
              })
            }
          }
          await getAddress(getAddressOptions)
        } catch (err) {
          toast.error('install Xverse Wallet', {
            theme: 'colored',
            autoClose: 1000
          })
        }
      } else if (walletType === 'MagicEden') {
        try {
          await getAddress({
            getProvider: async () => {
              return window.magicEden?.bitcoin
            },
            payload: {
              purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
              message: 'Address for receiving Ordinals and payments',
              network: {
                type:
                  import.meta.VITE_NETWORK === 'testnet'
                    ? BitcoinNetworkType.Testnet
                    : BitcoinNetworkType.Mainnet
              }
            },
            onFinish: (response) => {
              console.log({ response })
              const address = response.addresses[0].address
              const paymentAddress = response.addresses[1].address
              const pubkey = response.addresses[0].publicKey
              const paymentPubkey = response.addresses[1].publicKey
              localStorage.setItem('walletType', walletType)
              localStorage.setItem('walletAddress', address)
              this.walletAddress = address
              modalStore.closeModal()
              toast.success('Magic Eden Wallet connected', {
                theme: 'colored',
                autoClose: 1000
              })
            },
            onCancel: () => {
              toast.warn('Request canceled', {
                theme: 'colored',
                autoClose: 1000
              })
            }
          })
        } catch (err) {
          toast.error('install Magic Eden Wallet', {
            theme: 'colored',
            autoClose: 1000
          })
        }
      }
    }
  }
})
