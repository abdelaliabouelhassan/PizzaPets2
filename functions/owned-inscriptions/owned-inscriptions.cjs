/* eslint-disable no-undef */
const axios = require('axios')

const handler = async (event) => {
  const address = event.queryStringParameters.address
  const token = '39cdda6d-f149-4122-9c00-b98726c8d95b'

  if (!address) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Address query parameter is required' })
    }
  }

  try {
    let pets = []
    let page = 1
    let hasMoreData = true

    while (hasMoreData) {
      const response = await axios.get(
        `https://api.ordiscan.com/v1/address/${address}/inscriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            page: page
          }
        }
      )

      const data = response.data
      if (data && data.length > 0) {
        pets = pets.concat(data)
        page++
      } else {
        hasMoreData = false
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(pets)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() })
    }
  }
}

module.exports = { handler }
