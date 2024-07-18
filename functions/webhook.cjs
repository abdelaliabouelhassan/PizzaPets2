const axios = require('axios')

const handler = async (event, context) => {
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
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Webhook received successfully" }),
        };
    } catch (error) {
        console.error("Error processing webhook:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" }),
        };
    }
};

module.exports = { handler }