import { useApiData } from '@/stores/apidata'
import { getProviders, setDefaultProvider } from '@sats-connect/core'
import { defineStore } from 'pinia'
import Wallet, { AddressPurpose, BitcoinNetworkType, getAddress } from 'sats-connect'
import { showToast } from '../utils/toast'
import { useOrderStore } from './order'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    walletType: localStorage.getItem('walletType') || '',
    paymentAddress: localStorage.getItem('paymentAddress') || '',
    paymentAddressPublicKey: localStorage.getItem('paymentAddressPublicKey') || '',
    ordinalAddress: localStorage.getItem('ordinalAddress') || '',
    ordinalAddressPublicKey: localStorage.getItem('ordinalAddressPublicKey') || ''
  }),
  getters: {
    isLoggedIn(state) {
      return [
        'walletType',
        'paymentAddress',
        'paymentAddressPublicKey',
        'ordinalAddress',
        'ordinalAddressPublicKey'
      ].every((key) => state[key] !== '')
    },
    getWalletType: (state) => state.walletType,
    getPaymentAddress: (state) => state.paymentAddress,
    getPaymentAddressPublicKey: (state) => state.paymentAddressPublicKey,
    getOrdinalAddress: (state) => state.ordinalAddress,
    getOrdinalAddressPublicKey: (state) => state.ordinalAddressPublicKey
  },
  actions: {
    signOut() {
      const apiData = useApiData()
      apiData.resetState()

      const orderStore = useOrderStore()
      orderStore.resetState()

      this.clearLocalStorage()
      this.resetState()
    },
    async connectWallet(walletType) {
      try {
        switch (walletType) {
          case 'Unisat':
            await this.connectUnisatWallet(walletType)
            break
          case 'MagicEden':
            await this.connectMagicEdenWallet(walletType)
            break
          default:
            await this.connectOtherWallet(walletType)
        }
      } catch (err) {
        console.error('connectWallet: ', err)
        showToast(`Install ${walletType} Wallet`, 'error')
      }
    },
    async connectUnisatWallet(walletType) {
      const unisat = window.unisat
      await this.ensureCorrectNetwork(unisat)
      const addresses = await unisat.requestAccounts()
      const publicKey = await unisat.getPublicKey()

      this.updateStorageAndState(walletType, addresses[0], publicKey, addresses[0], publicKey)
    },
    async connectMagicEdenWallet(walletType) {
      const magicEden = window.magicEden?.bitcoin
      if (!magicEden) {
        showToast(`Install ${walletType} wallet`, 'error')
        return
      }

      const options = this.getAddressOptions(walletType)
      options.getProvider = async () => magicEden

      await getAddress(options)
    },
    async connectOtherWallet(walletType) {
      const providers = getProviders()
      const isXverse = providers.some(
        (provider) => provider.id === 'XverseProviders.BitcoinProvider'
      )

      if (isXverse) {
        setDefaultProvider('XverseProviders.BitcoinProvider')
        const res = await Wallet.request('getAccounts', {
          purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals]
        })

        if (res.status === 'error') {
          return showToast(res.error.message, 'error')
        }

        this.handleAddressResponse(walletType, res.result)
      } else {
        showToast(`Install ${walletType} Wallet`, 'error')
      }
    },
    async ensureCorrectNetwork(unisat) {
      const currentNetwork = await unisat.getNetwork()
      const desiredNetwork = import.meta.env.VITE_NETWORK === 'testnet' ? 'testnet' : 'livenet'

      if (currentNetwork !== desiredNetwork) {
        await unisat.switchNetwork(desiredNetwork)
      }
    },
    getAddressOptions(walletType) {
      const networkType =
        import.meta.env.VITE_NETWORK === 'testnet'
          ? BitcoinNetworkType.Testnet
          : BitcoinNetworkType.Mainnet

      return {
        payload: {
          purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
          message: 'Address for receiving Ordinals and payments',
          network: { type: networkType }
        },
        onFinish: (response) => this.handleAddressResponse(walletType, response.addresses)
      }
    },
    handleAddressResponse(walletType, addresses) {
      if (!addresses) return

      const getAddress = (purpose) => {
        const addr = addresses.find((addr) => addr.purpose === purpose)
        return addr ? addr.address : ''
      }

      const getPublicKey = (purpose) => {
        const addr = addresses.find((addr) => addr.purpose === purpose)
        return addr ? addr.publicKey : ''
      }

      const paymentAddress = getAddress('payment')
      const ordinalAddress = getAddress('ordinals')
      const paymentAddressPublicKey = getPublicKey('payment')
      const ordinalAddressPublicKey = getPublicKey('ordinals')

      this.updateStorageAndState(
        walletType,
        paymentAddress,
        paymentAddressPublicKey,
        ordinalAddress,
        ordinalAddressPublicKey
      )
    },
    updateStorageAndState(
      walletType,
      paymentAddress,
      paymentAddressPublicKey,
      ordinalAddress,
      ordinalAddressPublicKey
    ) {
      this.updateLocalStorage(
        walletType,
        paymentAddress,
        ordinalAddress,
        paymentAddressPublicKey,
        ordinalAddressPublicKey
      )
      this.updateState(
        walletType,
        paymentAddress,
        ordinalAddress,
        paymentAddressPublicKey,
        ordinalAddressPublicKey
      )
    },
    updateLocalStorage(
      walletType,
      paymentAddress,
      ordinalAddress,
      paymentAddressPublicKey,
      ordinalAddressPublicKey
    ) {
      localStorage.setItem('walletType', walletType)
      localStorage.setItem('paymentAddress', paymentAddress)
      localStorage.setItem('ordinalAddress', ordinalAddress)
      localStorage.setItem('paymentAddressPublicKey', paymentAddressPublicKey)
      localStorage.setItem('ordinalAddressPublicKey', ordinalAddressPublicKey)
    },
    updateState(
      walletType,
      paymentAddress,
      ordinalAddress,
      paymentAddressPublicKey,
      ordinalAddressPublicKey
    ) {
      this.walletType = walletType
      this.paymentAddress = paymentAddress
      this.ordinalAddress = ordinalAddress
      this.paymentAddressPublicKey = paymentAddressPublicKey
      this.ordinalAddressPublicKey = ordinalAddressPublicKey
    },
    clearLocalStorage() {
      ;[
        'walletType',
        'paymentAddress',
        'ordinalAddress',
        'paymentAddressPublicKey',
        'ordinalAddressPublicKey'
      ].forEach((key) => localStorage.removeItem(key))
    },
    resetState() {
      this.walletType = ''
      this.paymentAddress = ''
      this.ordinalAddress = ''
      this.paymentAddressPublicKey = ''
      this.ordinalAddressPublicKey = ''
    }
  }
})
