import { defineStore } from 'pinia'
import { AddressPurpose, BitcoinNetworkType, getAddress } from 'sats-connect'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

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
        } else if (walletType == 'Leather') {
          const addressesRes = await window.btc.request('getAddresses', {})
          const address = addressesRes.result.addresses.find((address) => address.type === 'p2tr')
          localStorage.setItem('walletType', walletType)
          localStorage.setItem('walletAddress', address.address)
          this.walletAddress = address.address
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
          console.log('Addresses', response)
          const address = response.addresses[0].address
          localStorage.setItem('walletType', walletType)
          localStorage.setItem('walletAddress', address)
          this.walletAddress = address
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
