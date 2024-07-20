<script setup>
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/auth'
import { useApiData } from '@/stores/apidatas'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Initialize the toast notification
const authStore = useAuthStore()
const apiData = useApiData()

const sendInscription = async (parents) => {
  if (apiData.parents.length == 0) {
    toast.error(`Please select parents`, {
      theme: 'colored',
      autoClose: 3000,
      position: 'bottom-right'
    })
  } else if (apiData.files.length == 0) {
    toast.error(`Please select feeds`, {
      theme: 'colored',
      autoClose: 3000,
      position: 'bottom-right'
    })
  } else {
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
      const files = apiData.files.map((data) => ({
        name: `${data.label}.txt`,
        type: 'plain/text',
        size: new TextEncoder().encode(data.label).length,
        dataURL: `data:plain/text;base64,${btoa(data.label)}`
      }))

      const requestPayload = {
        files: files,
        parents,
        receiveAddress: authStore.walletAddress,
        lowPostage: true,
        fee: 9,
        webhookUrl: `https://feed.pets.pizza/.netlify/functions/webhook`
      }

      const inscription = this.$inscription.Inscription()
      const response = await inscription.createDirectOrder(requestPayload)

      await supabase
        .from('orders')
        .insert({
          user_address: authStore.walletAddress,
          order_id: response.id,
          order_status: response.state,
          transaction_sent: false,
          order_content: response
        })
        .select()

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
}

const handleDirectOrderButtonClick = async () => {
  console.log(apiData.parents)
  const parents = apiData.parents.map((data) => ({
    inscriptionId: data.inscriptionId,
    returnAddress: data.address,
    value: data.outSatoshi
  }))

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
