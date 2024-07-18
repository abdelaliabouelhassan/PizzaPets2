import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vrfpbxzvzmbpgwiukskw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZnBieHp2em1icGd3aXVrc2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjAzMDAsImV4cCI6MjAzNjg5NjMwMH0.MEszPywJMv0eZ-SVQ8OKW8285lu4xp4aNc4HqBb1nY4";

const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (event) => {
    try {
        // Check if the request method is POST
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: "Method Not Allowed",
            };
        }

        // Parse the incoming JSON payload
        const data = JSON.parse(event.body);

        // Log the received data (you can process it here as needed)
        console.log("Received webhook data:", data);

        // Handle different states of the inscription order
        switch (data.state) {
            case "waiting-confirmation":
                console.log(`Order ${data.id} is waiting for confirmation.`);
                break;
            case "prep":
                console.log(`Order ${data.id} is being prepared.`);
                break;
            case "queued":
                console.log(`Order ${data.id} is queued for processing.`);
                break;
            case "file-inscribed":
                console.log(`File inscribed for order ${data.id}.`);
                console.log(`File details:`, data.file);
                console.log(`Transaction details:`, data.tx);
                break;
            default:
                console.log(`Unknown state: ${data.state} for order ${data.id}.`);
                break;
        }

        // Respond with a success message
        await supabase
            .from('orders')
            .update({ order_content: data })
            .eq('order_id', data.id)
    } catch (error) {
        console.error("Error processing webhook:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" }),
        };
    }
};

module.exports = { handler }