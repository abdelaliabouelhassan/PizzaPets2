<script setup>
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/auth'
import { useModalStore } from '@/stores/modal'
import { useApiData } from '@/stores/apidata'
import { showToast } from '@/utils/toast'
import AppModal from '@/components/AppModal.vue'
import { ref } from 'vue'
import { getOrdinalsbotInstance } from '@/utils/ordinalsBot'

const authStore = useAuthStore()
const apiData = useApiData()
const modalStore = useModalStore()

const orderId = ref('')
const fetching = ref(false)

const createChildrenFilesPayload = (files) => {
  return files.map((data) => ({
    name: `${data.label}.txt`,
    type: 'plain/text',
    size: new TextEncoder().encode(data.label).length,
    dataURL: `data:plain/text;base64,${btoa(data.label)}`
  }))
}

const insertOrderToSupabase = async (response) => {
  await supabase
    .from('orders')
    .insert({
      payment_address: authStore.getPaymentAddress,
      payment_address_public_key: authStore.getPaymentAddressPublicKey,
      ordinal_address: authStore.getOrdinalAddress,
      ordinal_address_public_key: authStore.getOrdinalAddressPublicKey,
      order_id: response.id,
      order_status: response.state,
      order_content: response
    })
    .select()
}

const sendInscription = async (parents) => {
  if (fetching.value) return
  fetching.value = true
  if (apiData.getParents?.length === 0) {
    showToast('Please select parents', 'error')
    fetching.value = false
    return
  }
  if (apiData.getFiles?.length === 0) {
    showToast('Please select at least 1 option', 'error')
    fetching.value = false
    return
  }
  if (!authStore.getOrdinalAddress) {
    showToast('Please connect your wallet', 'error')
    fetching.value = false
    return
  }

  try {
    const files = createChildrenFilesPayload(apiData.getFiles)

    const requestPayload = {
      files,
      parents,
      receiveAddress: authStore.getOrdinalAddress,
      lowPostage: true,
      fee: 9,
      webhookUrl: `https://feed.pets.pizza/.netlify/functions/webhook`
    }

    const ordinalsbot = getOrdinalsbotInstance()
    const inscription = ordinalsbot.Inscription()
    const response = await inscription.createDirectOrder(requestPayload)

    await insertOrderToSupabase(response)

    orderId.value = response.id

    modalStore.openModal('order-summary')

    fetching.value = false
    return true
  } catch (error) {
    fetching.value = false

    console.error('Something went wrong:', error)
    showToast('Something went wrong', 'error')
  }
}

const handleDirectOrderButtonClick = async () => {
  const parents = apiData.getParents?.map((data) => ({
    inscriptionId: data.inscriptionId,
    returnAddress: data.address,
    value: data.outSatoshi
  }))
  await sendInscription(parents)
}
</script>

<template>
  <div class="flex items-center justify-end gap-x-12 px-4 mt-24">
    <h5 class="text-2xl font-semibold">
      You are going to feed {{ apiData.getParents?.length ? apiData.getParents.length : 0 }} pet
    </h5>
    <a
      @click="handleDirectOrderButtonClick"
      class="py-3 px-4 bg-[#FF5400] text-white text-[18px] h-[48px] min-w-[178px] border-4 border-black ring-4 ring-white hover:scale-105 duration-200 mr-1 cursor-pointer flex items-center justify-center"
    >
      Submit
    </a>
  </div>

  <AppModal modalId="order-summary">
    <h1>ORDER ID: {{ orderId }}</h1>
    <h1>ORDERS: {{ apiData.getOrders }}</h1>
  </AppModal>
</template>
