<script setup>
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/auth'
import { Ordinalsbot } from 'ordinalsbot'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Initialize the toast notification
const authStore = useAuthStore()

const sendInscription = async (parents) => {
  if (!authStore.walletAddress) {
    toast.error(`Please connect your wallet`, {
      theme: 'colored',
      autoClose: 3000,
      position: 'bottom-right'
    })
    return
  }
  toast.success(`Creating direct order...`, {
    theme: 'colored',
    autoClose: 3000,
    position: 'bottom-right'
  })
  try {
    const files = [
      {
        url: 'https://ordinalsbot-dev.s3.amazonaws.com/c14ff107-3f1c-42b9-8e70-e87f674d0530',
        size: 549,
        name: 'btc-skull-3.jpg',
        type: 'image/jpeg'
      }
    ]
    const requestPayload = {
      files: files,
      parents,
      receiveAddress: authStore.walletAddress,
      lowPostage: true,
      fee: 9,
      webhookUrl: `${import.meta.env.VITE_NETWORK == 'testnet' ? 'https://feed.pets.pizza' : window.location.origin}/.netlify/functions/webhook`
    }

    const ordinalsbotObj = new Ordinalsbot('', import.meta.env.VITE_NETWORK)
    const inscription = ordinalsbotObj.Inscription()
    const response = await inscription.createDirectOrder(requestPayload)

    const data = await supabase
      .from('orders')
      .insert({
        user_address: authStore.walletAddress,
        receive_address: response.receiveAddress,
        order_id: response.id,
        order_status: response.state,
        transaction_sent: false,
        order_content: response
      })
      .select()
    console.log(data)

    toast.success(`Direct Order created successfully: ${response.id}`, {
      theme: 'colored',
      autoClose: 3000,
      position: 'bottom-right'
    })

    return true
  } catch (error) {
    toast.error(`Something went wrong`, {
      theme: 'colored',
      autoClose: 3000,
      position: 'bottom-right'
    })
    console.error('Something went wrong:', error)
  }
}

const handleDirectOrderButtonClick = async () => {
  const parents = [] // Define the parents variable as needed
  await sendInscription(parents)
}
</script>

<template>
  <div class="flex items-center justify-end gap-x-12">
    <h5 class="text-2xl font-semibold">You are going to feed 1 pet</h5>
    <a
      @click="handleDirectOrderButtonClick"
      class="py-3 px-4 bg-[#FF5400] text-white text-[18px] h-[48px] min-w-[178px] border-4 border-black ring-4 ring-white hover:scale-105 duration-200 mr-1 cursor-pointer flex items-center justify-center"
    >
      Submit
    </a>
  </div>
</template>
