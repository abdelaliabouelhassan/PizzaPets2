import { showToast } from '@/utils/toast'

export const getMempoolFeeSummary = async () => {
  try {
    const data = await fetch('https://mempool.space/api/v1/fees/recommended')
    const jsonData = await data.json()
    return jsonData.halfHourFee
  } catch (error) {
    console.log(error)
    showToast('Error fetching mempool fee', 'error')
  }
}
