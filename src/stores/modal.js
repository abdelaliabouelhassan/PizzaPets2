// store.js
import { defineStore } from 'pinia'
import {
  getAddress,
  BitcoinNetworkType,
  AddressPurpose,
} from "sats-connect";
export const useModalStore = defineStore('modal', {
  state: () => ({
    open: false,
    logoutOpen: false,
    walletAddress: localStorage.getItem("walletAddress") || "",
  }),
  actions: {
    openModal() {
      this.open = true
    },
    closeModal() {
      this.open = false
    },
    openLogout() {
      this.logoutOpen = !this.logoutOpen
    },
    closeConnectWallet() {
      this.walletAddress = "";
      this.logoutOpen = false
      localStorage.setItem("walletAddress", "");
      localStorage.setItem("walletType", "");
    },
    async WalletConnect(walletType) {
      if (walletType === "Xverse") {
        try {
          const getAddressOptions = {
            payload: {
              purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
              message: "Address for receiving Ordinals",
              network: {
                type: BitcoinNetworkType.Mainnet
              },
            },
            onFinish: (response) => {
              const address = response.addresses[0].address;
              const paymentAddress = response.addresses[1].address;
              const pubkey = response.addresses[0].publicKey;
              const paymentPubkey = response.addresses[1].publicKey;
              localStorage.setItem("walletType", walletType);
              localStorage.setItem("walletAddress", address);
              this.walletAddress = address;
              this.open = false;
            },
            onCancel: () => {
              alert('Request canceled');
            },
          };
          await getAddress(getAddressOptions);
        } catch (err) {
        }
      } else if (walletType === "MagicEden") {
        try {
          await getAddress({
            getProvider: async () => {
              return window.magicEden.bitcoin;
            },
            payload: {
              purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
              message: 'Address for receiving Ordinals and payments',
              network: {
                type: process.env.NETWORK === "testnet" ? BitcoinNetworkType.Testnet : BitcoinNetworkType.Mainnet,
              },
            },
            onFinish: (response) => {
              console.log({ response })
              const address = response.addresses[0].address;
              const paymentAddress = response.addresses[1].address;
              const pubkey = response.addresses[0].publicKey;
              const paymentPubkey = response.addresses[1].publicKey;
              localStorage.setItem("walletType", walletType);
              localStorage.setItem("walletAddress", address);
              this.walletAddress = address;
              this.open = false;
            },
            onCancel: () => {
              alert('Request canceled');
            },
          });
        } catch (err) {
          console.log('error: ', err)
        }
      }
    }
  }
})
