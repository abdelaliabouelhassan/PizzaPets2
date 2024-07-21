import { showToast } from '@/utils/toast'

/**
 * Fetches the mempool fee summary.
 *
 * @param {string} feeType - The type of fee to retrieve. Options are:
 *  - 'fastestFee': The fee for the fastest transaction confirmation.
 *  - 'halfHourFee': The fee for a transaction to confirm within half an hour.
 *  - 'hourFee': The fee for a transaction to confirm within an hour.
 *  - 'economyFee': The fee for a transaction with an economical fee.
 *  - 'minimumFee': The minimum fee for a transaction.
 *
 * @returns {number} The recommended fee for the specified type.
 * @throws {Error} If an invalid fee type is provided or if there is an error fetching the data.
 */
export const getMempoolFeeSummary = async (feeType = 'halfHourFee') => {
  try {
    const data = await fetch(
      `https://${import.meta.env.VITE_NETWORK === 'testnet' ? 'testnet.' : ''}mempool.space/api/v1/fees/recommended`
    )
    const jsonData = await data.json()
    if (jsonData[feeType] !== undefined) {
      return jsonData[feeType]
    } else {
      throw new Error('Invalid fee type')
    }
  } catch (error) {
    console.log(error)
    showToast('Error fetching mempool fee', 'error')
  }
}
