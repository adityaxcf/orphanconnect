const express   = require("express");
const router    = express.Router();
const Razorpay  = require("razorpay");
const crypto    = require("crypto");
const { authMiddleware } = require("../middleware/auth");

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// POST create Razorpay order
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST verify payment signature
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ verified: true, paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ verified: false, error: "Payment verification failed." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
