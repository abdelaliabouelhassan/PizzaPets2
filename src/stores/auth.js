import { useApiData } from '@/stores/apidata'
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
    isLoggedIn() {
      return (
        this.walletType !== '' &&
        this.paymentAddress !== '' &&
        this.paymentAddressPublicKey !== '' &&
        this.ordinalAddress !== '' &&
        this.ordinalAddressPublicKey !== ''
      )
    },
    getWalletType() {
      return this.walletType
    },
    getPaymentAddress() {
      return this.paymentAddress
    },
    getPaymentAddressPublicKey() {
      return this.paymentAddressPublicKey
    },
    getOrdinalAddress() {
      return this.ordinalAddress
    },
    getOrdinalAddressPublicKey() {
      return this.ordinalAddressPublicKey
    }
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
        if (walletType === 'Unisat') {
          await this.connectUnisatWallet(walletType)
        } else if (walletType === 'MagicEden') {
          await this.connectMagicEdenWallet(walletType)
        } else {
          // TODO: This is making another modal appear for the login we need to change this behavior
          const res = await Wallet.request('getAccounts', {
            purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals]
          })
          this.handleAddressResponse(walletType, res.result)
        }
      } catch (err) {
        console.log(err)
        showToast(`Install ${walletType} Wallet`, 'error')
      }
    },
    async connectUnisatWallet(walletType) {
      const unisat = window.unisat
      await this.ensureCorrectNetwork(unisat)
      const addresses = await unisat.requestAccounts()
      const publicKey = await unisat.getPublicKey()

      this.updateLocalStorage(walletType, addresses[0], addresses[0], publicKey, publicKey)
      this.updateState(walletType, addresses[0], addresses[0], publicKey, publicKey)
    },
    async connectMagicEdenWallet(walletType) {
      const magicEden = window.magicEden?.bitcoin
      if (!magicEden) {
        showToast('MagicEden wallet not found', 'error')
        return
      }

      const getAddressOptions = this.getAddressOptions(walletType)
      getAddressOptions.getProvider = async () => magicEden

      const response = await getAddress(getAddressOptions)
      this.handleAddressResponse(walletType, response.addresses)
    },
    async ensureCorrectNetwork(unisat) {
      let network = await unisat.getNetwork()
      if (network === 'livenet' && import.meta.env.VITE_NETWORK === 'testnet') {
        await unisat.switchNetwork('testnet')
      }
      if (network === 'testnet' && import.meta.env.VITE_NETWORK === 'mainnet') {
        await unisat.switchNetwork('livenet')
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
          network: { type: networkType }
        },
        onFinish: (response) => this.handleAddressResponse(walletType, response.addresses),
        onCancel: () => showToast('Request canceled', 'error')
      }

      return options
    },
    handleAddressResponse(walletType, response) {
      if (response === undefined) {
        return
      }
      const paymentAddress = this.getAddressByPurpose(response, 'payment')
      const ordinalAddress = this.getAddressByPurpose(response, 'ordinals')
      const paymentAddressPublicKey = this.getPublicKeyByPurpose(response, 'payment')
      const ordinalAddressPublicKey = this.getPublicKeyByPurpose(response, 'ordinals')

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
    getAddressByPurpose(addresses, purpose) {
      const addressObj = addresses.find((addr) => addr.purpose === purpose)
      return addressObj ? addressObj.address : ''
    },
    getPublicKeyByPurpose(addresses, purpose) {
      const addressObj = addresses.find((addr) => addr.purpose === purpose)
      return addressObj ? addressObj.publicKey : ''
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
      localStorage.removeItem('walletType')
      localStorage.removeItem('paymentAddress')
      localStorage.removeItem('ordinalAddress')
      localStorage.removeItem('paymentAddressPublicKey')
      localStorage.removeItem('ordinalAddressPublicKey')
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
