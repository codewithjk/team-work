const express = require("express");
const SubscriptionController = require("../controllers/subscriptionController");

const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY, {
  apiVersion: "2024-09-30.acacia",
});
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const subscriptionController = new SubscriptionController();
router.route("/").post(subscriptionController.handleEvents);

module.exports = router;
