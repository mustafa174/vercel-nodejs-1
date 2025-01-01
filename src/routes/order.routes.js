import { Router } from "express";
import orderController from "../controllers/order.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { API_PREFIX_V1 } from "../utils/constants";
const stripe = require("stripe")(
  "sk_test_51NXT6EG9JhNDU81sU0DTOv2L3HRd5a2uL6OSSeQ6hR0eisK9BD9DRLHLjyNuFQXH0uPzpFYAmfqVBDDS4uJDZo2u00XbsNajEI"
);
const orderRoutes = Router();

// Order-related routes
orderRoutes.post(`/${API_PREFIX_V1}/orders/create`, authMiddleware, orderController.createOrder);
// Sample route for creating an order

orderRoutes.get(`/${API_PREFIX_V1}/orders`, authMiddleware, orderController.getAllOrders);
orderRoutes.get(`/${API_PREFIX_V1}/orders/:id`, authMiddleware, orderController.getOrderById);
orderRoutes.put(`/${API_PREFIX_V1}/orders/:id`, authMiddleware, orderController.updateOrder);
orderRoutes.delete(`/${API_PREFIX_V1}/orders/:id`, authMiddleware, orderController.deleteOrder);
orderRoutes.post(`/${API_PREFIX_V1}/create-payment-intent`, async (req, res) => {
  const { amount } = req.body; // e.g., amount = 5000 (representing $50.00)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd", // or any currency you're working with
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default orderRoutes;

orderRoutes.get(`/${API_PREFIX_V1}/transactions-history`, authMiddleware, async (req, res) => {
  try {
    // Fetch all payment intents
    const paymentIntents = await stripe.paymentIntents.list();

    // Map and format transactions
    const transactions = await Promise.all(
      paymentIntents.data.map(async (intent) => {
        let paymentMethod = {};
        if (intent.payment_method) {
          paymentMethod = await stripe.paymentMethods.retrieve(intent.payment_method);
        }

        let customer = {};
        if (intent.customer) {
          customer = await stripe.customers.retrieve(intent.customer);
        }

        return {
          id: intent.id,
          amount: intent.amount / 100,
          currency: intent.currency,
          created: new Date(intent.created * 1000), // Convert to Date object
          status: intent.status,
          customer: customer.name || "Unknown",
          email: customer.email || paymentMethod.billing_details?.email || "Not Provided",
          phone: customer.phone || paymentMethod.billing_details?.phone || "Not Provided",
          card: paymentMethod.card?.last4 || "Unknown",
          owner_name: paymentMethod.billing_details?.name || "Unknown",
          postal_code: paymentMethod.billing_details?.address?.postal_code || "Not Provided",
        };
      })
    );

    // Sort transactions by most recent
    const sortedTransactions = transactions.sort((a, b) => b.created - a.created);

    res.json(sortedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("Internal Server Error");
  }
});
