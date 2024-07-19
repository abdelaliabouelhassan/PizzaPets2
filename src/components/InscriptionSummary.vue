<script setup>
import { supabase } from '@/utils/supabase'
import axios from 'axios'

const sendInscription = async () => {
  const response = await axios.post(
    `https://${import.meta.env.VITE_NETWORK == 'testnet' && 'testnet-'}api.ordinalsbot.com/inscribe`,
    {
      files: [
        {
          size: 10,
          type: 'plain/text',
          name: 'my-text-inscription-file.txt',
          dataURL: 'data:plain/text;base64,dGVzdCBvcmRlcg==',
          metadataDataURL:
            'data:application/json;base64,ewogICAgImluc2NyaWJlZF9ieSI6ICJPcmRpbmFsc0JvdCIKfQ==',
          metadataSize: 37
        }
      ],
      lowPostage: true,
      receiveAddress: 'tb1pk5uh44r9hk9z33ygpkrqcnupaw28q07xvg9eu7utv4wv3d3q58pqj859wl',
      fee: '11',
      webhookUrl: `${window.location.origin}/.netlify/functions/webhook`
    },
    { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
  )
  const data = await supabase.from('orders').insert({
    address: response.data.receiveAddress,
    order_id: response.data.id
  })
  console.log(data)
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
