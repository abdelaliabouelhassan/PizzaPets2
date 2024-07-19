/* eslint-disable no-undef */
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vrfpbxzvzmbpgwiukskw.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZnBieHp2em1icGd3aXVrc2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjAzMDAsImV4cCI6MjAzNjg5NjMwMH0.MEszPywJMv0eZ-SVQ8OKW8285lu4xp4aNc4HqBb1nY4'

const supabase = createClient(supabaseUrl, supabaseKey)

const updateOrderStatus = async (orderId, status, data) => {
  await supabase
    .from('orders')
    .update({ order_status: status, order_content: data })
    .eq('order_id', orderId)
}

const handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' })
      }
    }

    const data = JSON.parse(event.body)
    const { state, id } = data
    const validStates = [
      'waiting-confirmation',
      'waiting-payment',
      'waiting-parent',
      'error',
      'cancelled',
      'waiting-refund',
      'refunded',
      'expired',
      'waiting-reveal',
      'waiting-rune-balance',
      'completed',
      'prep',
      'queued',
      'file-inscribed'
    ]

    const status = validStates.includes(state) ? state : 'unknown-state'
    await updateOrderStatus(id, status, data)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook processed successfully' })
    }
  } catch (error) {
    console.error('Error processing webhook:', error)

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    }
  }
}

module.exports = { handler }