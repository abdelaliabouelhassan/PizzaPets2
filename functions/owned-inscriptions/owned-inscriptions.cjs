/* eslint-disable no-undef */
const axios = require('axios')

const API_KEYS = ['2ad650a7a2dfeb22f287de85adcf9d72fe50fe68c7b61301273717559b652d72']

let currentApiKeyIndex = 0

const getNextApiKey = () => {
  const apiKey = API_KEYS[currentApiKeyIndex]
  currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length
  return apiKey
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const handler = async (event) => {
  const address = event.queryStringParameters.address
  const network = 'mainnet'

  if (!address) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Address query parameter is required' })
    }
  }

  try {
    let pets = []
    let cursor = 0
    let size = 1000
    let hasMoreData = true

    while (hasMoreData) {
      const response = await axios.get(
        `https://open-api${network == 'testnet' ? '-testnet.' : '.'}unisat.io/v1/indexer/address/${address}/inscription-data`,
        {
          headers: {
            Authorization: `Bearer ${getNextApiKey()}`,
            accept: 'application/json'
          },
          params: {
            cursor: cursor,
            size: size
          }
        }
      )

      const data = response.data
      hasMoreData = response.data.data.totalConfirmed > cursor + size
      if (data && data.data && data.data.inscription.length > 0) {
        pets = pets.concat(data.data.inscription)
        cursor += size
      }
      await delay(250) // Add a delay of 250ms (4 requests per second - limit is 5)
    }
    // TODO: Need to filter and return only the pets that are alive
    return {
      statusCode: 200,
      body: JSON.stringify(pets)
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() })
    }
  }
}

module.exports = { handler }
