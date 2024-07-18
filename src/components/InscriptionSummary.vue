<script setup>
// import { supabase } from '@/utils/supabase'
import axios from 'axios'

const sendInscription = async () => {
  // const { data, error } = await supabase.from('orders').insert({
  //   address: 'tb1pk5uh44r9hk9z33ygpkrqcnupaw28q07xvg9eu7utv4wv3d3q58pqj859wl',
  //   order_id: '659193e72b8894ec341c8597c7efbb31b0b99f71706109a05d15d8df5ad9ad51i0'
  // })
  // const data = await supabase.from('orders').select()
  // console.log(data)
  const response = await axios.post(
    `https://testnet-api.ordinalsbot.com/inscribe`,
    {
      // files:[
      //   {
      //     name: "VHK",
      //     size: 887,
      //     dataURL: "https://static-testnet.unisat.io/content/659193e72b8894ec341c8597c7efbb31b0b99f71706109a05d15d8df5ad9ad51i0"
      //   }
      // ],
      // receiveAddress:[

      // ]
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
  console.log(response)
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
  </div>
</template>
