/* eslint-disable no-undef */
const axios = require('axios')

const handler = async (event) => {
  const address = event.queryStringParameters.address

  const API_KEY = '80be57d923c7870c139250d1fca2dc979702d153fa208fe1e8c53c3ee74b94b8'
  const network = 'testnet'
  if (!address) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Address query parameter is required' })
    }
  }

  try {
    let pets = []
    let cursor = 0
    let size = 30
    let hasMoreData = true

    while (hasMoreData) {
      const response = await axios.get(
        `https://open-api${network == 'testnet' ? '-testnet' : ''}.unisat.io/v1/indexer/address/${address}/inscription-data`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`
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
    }
    //TODO: Need to filter and return only the pets that are alive
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
