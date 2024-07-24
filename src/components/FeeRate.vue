<script setup>
import { ref, watchEffect, computed } from 'vue'
import { useApiData } from '@/stores/apidata'
import { getMempoolFeeSummary } from '@/utils/getMempoolFeeSummary'
import { useAuthStore } from '@/stores/auth'

// Initialize res as a reactive state variable
const res = ref({
  fastestFee: 0,
  halfHourFee: 0,
  hourFee: 0,
  economyFee: 0,
  minimumFee: 0
})

// Use API data from the store
const apiData = useApiData()
const authStore = useAuthStore()

// Fetch data and update res
watchEffect(async () => {
  console.log('Fetching mempool fee summary...')
  res.value = await getMempoolFeeSummary()
  apiData.lowFee = res.value.minimumFee
  apiData.fee = res.value.halfHourFee // Set default fee to halfHourFee
  console.log('Updated res:', res.value)
})

// Define feeData as a computed property that updates based on res
const feeData = computed(() => ({
  mediumFeeRate: res.value.halfHourFee,
  highFeeRate: res.value.fastestFee
}))

// Fee mode state
const feeMode = ref('medium') // Default mode set to 'medium'

// Update feeMode and apiData.fee based on selected mode
const setFeeMode = (mode) => {
  feeMode.value = mode
  if (mode !== 'custom') {
    apiData.fee = feeData.value[`${mode}FeeRate`]
  }
}

// Update apiData.fee manually for 'custom' mode
const onChangeFee = (value) => {
  apiData.fee = value
}
</script>

<template>
  <div v-if="authStore.paymentAddress" class="mx-5 text-2xl text-white">
    <div class="mt-14 text-center font-bold text-white">
      We recommend setting a high enough fee rate for your order to be comfirmed
    </div>
    <div class="mt-4 grid grid-cols-3 gap-6">
      <div
        class="cursor-pointer border-4 border-black py-4 text-center ring-4 ring-white duration-200 hover:scale-105"
        :class="feeMode === 'medium' ? 'bg-[#FF5400]' : 'bg-main'"
        @click="setFeeMode('medium')"
      >
        <div>Medium priority</div>
        <div>{{ feeData.mediumFeeRate }} Sats / vByte</div>
      </div>
      <div
        class="cursor-pointer border-4 border-black py-4 text-center ring-4 ring-white duration-200 hover:scale-105"
        :class="feeMode === 'high' ? 'bg-[#FF5400]' : 'bg-main'"
        @click="setFeeMode('high')"
      >
        <div>High priority</div>
        <div>{{ feeData.highFeeRate }} Sats / vByte</div>
      </div>
      <div
        class="cursor-pointer border-4 border-black py-4 text-center ring-4 ring-white duration-200 hover:scale-105"
        :class="feeMode === 'custom' ? 'bg-[#FF5400]' : 'bg-main'"
        @click="setFeeMode('custom')"
      >
        <div>Custom</div>
        <div>Manual Setting</div>
      </div>
    </div>
    <div v-if="feeMode === 'custom'" class="mt-4">
      <input
        class="mb-2 w-full cursor-pointer border-4 border-white bg-black p-2 ring-4 ring-black active:border-white"
        v-model="apiData.fee"
        @input="onChangeFee($event.target.value)"
        type="number"
      />
    </div>
    <div
      class="mt-4 flex justify-between border-4 border-black bg-[#d8c836] p-4 text-black ring-4 ring-white"
    >
      <div>FeeRate</div>
      <div>{{ apiData.fee }} sats / VByte</div>
    </div>
  </div>
</template>
