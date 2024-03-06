import Razorpay from 'razorpay';

// Initialize Razorpay with your API keys (make sure to set these in your environment variables)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Async function to create a Razorpay order and then capture the payment
export async function create_payment(req, res) {
    try {
        // Step 1: Create an order in Razorpay
        const order = await razorpay.orders.create({
            amount: "5000", // amount in the smallest currency unit
            currency: 'INR',
            receipt: 'receipt#1',
            notes: {
                key1: "value3",
                key2: "value2"
            } // set to 1 to auto-capture the payment
        });
        console.log(order)

        // Step 2: Use the order ID to capture the payment on the frontend
        // You would typically send this order ID to the frontend to capture the payment

        // In this example, since there is no frontend, we simulate a payment capture using the order ID
        // This is not the standard way to capture payments with Razorpay and is for testing purposes only
        // In a real application, the payment capture would be done client-side after the user completes the payment process

        // Simulate a payment capture for demonstration purposes
        const payment = await razorpay.payments.capture(order.id, order.amount);
        console.log(payment)

        res.status(200).json(payment);
    } catch (error) {
        console.log("dfg")
        res.status(500).json(error);
    }
}
