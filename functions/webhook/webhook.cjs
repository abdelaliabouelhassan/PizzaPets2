/* eslint-disable no-undef */
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vrfpbxzvzmbpgwiukskw.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZnBieHp2em1icGd3aXVrc2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjAzMDAsImV4cCI6MjAzNjg5NjMwMH0.MEszPywJMv0eZ-SVQ8OKW8285lu4xp4aNc4HqBb1nY4'

const supabase = createClient(supabaseUrl, supabaseKey)

const handler = async (event) => {
  try {
    // Check if the request method is POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' })
      }
    }

    // Parse the incoming JSON payload
    const data = JSON.parse(event.body)

    // TODO: check if data.id => order_id exists in db and return if it does not

    // Handle different states of the inscription order
    switch (data.state) {
      case 'waiting-confirmation':
        await supabase
          .from('orders')
          .update({ order_status: 'waiting-confirmation', order_content: data })
          .eq('order_id', data.id)
        break
      case 'waiting-payment':
        await supabase
          .from('orders')
          .update({ order_status: 'waiting-payment', order_content: data })
          .eq('order_id', data.id)
      case 'waiting-parent':
        await supabase
          .from('orders')
          .update({ order_status: 'waiting-parent', order_content: data })
          .eq('order_id', data.id)
      case 'error':
        await supabase
          .from('orders')
          .update({ order_status: 'error', order_content: data })
          .eq('order_id', data.id)
      case 'cancelled':
        await supabase
          .from('orders')
          .update({ order_status: 'cancelled', order_content: data })
          .eq('order_id', data.id)
      case 'waiting-refund':
        await supabase
          .from('orders')
          .update({ order_status: 'waiting-refund', order_content: data })
          .eq('order_id', data.id)
      case 'refunded':
        await supabase
          .from('orders')
          .update({ order_status: 'refunded', order_content: data })
          .eq('order_id', data.id)
      case 'expired':
        await supabase
          .from('orders')
          .update({ order_status: 'expired', order_content: data })
          .eq('order_id', data.id)
      case 'waiting-reveal':
        await supabase
          .from('orders')
          .update({ order_status: 'waiting-reveal', order_content: data })
          .eq('order_id', data.id)
      case 'waiting-rune-balance':
        await supabase
          .from('orders')
          .update({ order_status: 'waiting-rune-balance', order_content: data })
          .eq('order_id', data.id)
      case 'completed':
        await supabase
          .from('orders')
          .update({ order_status: 'completed', order_content: data })
          .eq('order_id', data.id)
      case 'prep':
        await supabase
          .from('orders')
          .update({ order_status: 'prep', order_content: data })
          .eq('order_id', data.id)
        break
      case 'queued':
        await supabase
          .from('orders')
          .update({ order_status: 'queued', order_content: data })
          .eq('order_id', data.id)
        break
      case 'file-inscribed':
        await supabase
          .from('orders')
          .update({ order_status: 'file-inscribed', order_content: data })
          .eq('order_id', data.id)
        break
      default:
        await supabase
          .from('orders')
          .update({ order_status: 'unkown-state', order_content: data })
          .eq('order_id', data.id)
        break
    }

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
