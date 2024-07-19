<script setup>
import { supabase } from '@/utils/supabase'
// import axios from 'axios'
// import { useAuthStore } from '@/stores/auth'

// const authStore = useAuthStore()
const sendInscription = async () => {
  // const response = await axios.post(
  //   `https://${import.meta.env.VITE_NETWORK == 'testnet' && 'testnet-'}api.ordinalsbot.com/inscribe`,
  //   {
  //     files: [
  //       {
  //         size: 10,
  //         type: 'plain/text',
  //         name: 'my-text-inscription-file.txt',
  //         dataURL: 'data:plain/text;base64,dGVzdCBvcmRlcg==',
  //         metadataDataURL:
  //           'data:application/json;base64,ewogICAgImluc2NyaWJlZF9ieSI6ICJPcmRpbmFsc0JvdCIKfQ==',
  //         metadataSize: 37
  //       }
  //     ],
  //     lowPostage: true,
  //     receiveAddress: 'tb1pk5uh44r9hk9z33ygpkrqcnupaw28q07xvg9eu7utv4wv3d3q58pqj859wl',
  //     fee: '11',
  //     webhookUrl: `${import.meta.env.VITE_NETWORK == 'testnet' ? 'https://feed.pets.pizza' : window.location.origin}/.netlify/functions/webhook`
  //   },
  //   { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
  // )
  // const { id } = await inscription.createDirectOrder(requestPayload)
  // const handleDirectOrderButtonClick = async (parents) => {
  //   setDirectOrderMessages('', 'Creating direct order...')
  //   if (!paymentAddress || !ordinalsAddress) {
  //     setDirectOrderMessages('Please connect your wallet', '')
  //     return
  //   }
  //   try {
  //     const files = [
  //       {
  //         url: 'https://ordinalsbot-dev.s3.amazonaws.com/c14ff107-3f1c-42b9-8e70-e87f674d0530',
  //         size: 549,
  //         name: 'btc-skull-3.jpg',
  //         type: 'image/jpeg'
  //       }
  //     ]
  //     const requestPayload = {
  //       files: files,
  //       parents,
  //       receiveAddress: ordinalsAddress,
  //       lowPostage: true,
  //       fee: 9
  //     }
  //     const { id } = await inscription.createDirectOrder(requestPayload)
  //     setDirectOrderMessages('', `Direct Order created successfully: ${id}`)
  //     return true
  //   } catch (error) {
  //     setDirectOrderMessages('Something went wrong', '')
  //     console.error('Something went wrong:', error)
  //   }
  // }
  // const data = await supabase.from('orders').insert({
  //   user_address: response.data.receiveAddress,
  //   order_id: response.data.id,
  //   receive_address: authStore.walletAddress
  // })
  // console.log(data)
}

const checkData = async () => {
  const data = await supabase.from('orders').select()
  console.log(data)
}
</script>
<template>
  <div class="flex items-center justify-end gap-x-12">
    <h5 class="text-2xl font-semibold">You are going to feed 1 pet</h5>
    <a
      @click="sendInscription"
      class="py-3 px-4 bg-[#FF5400] text-white text-[18px] h-[48px] min-w-[178px] border-4 border-black ring-4 ring-white hover:scale-105 duration-200 mr-1 cursor-pointer flex items-center justify-center"
    >
      Submit
    </a>
    <a
      @click="checkData"
      class="py-3 px-4 bg-[#FF5400] text-white text-[18px] h-[48px] min-w-[178px] border-4 border-black ring-4 ring-white hover:scale-105 duration-200 mr-1 cursor-pointer flex items-center justify-center"
    >
      checkDB
    </a>
  </div>
</template>
