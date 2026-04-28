const express  = require("express");
const router   = express.Router();
const Ticket   = require("../models/Ticket");
const { authMiddleware, ownerOnly, adminOnly } = require("../middleware/auth");

// POST create ticket (user submits donate/volunteer/adopt)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.create({ ...req.body, userId: req.user.id });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET my tickets (logged in user)
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET tickets for a specific orphanage (owner)
router.get("/orphanage/:orphanageId", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const tickets = await Ticket.find({ orphanageId: req.params.orphanageId }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH approve or reject ticket (owner)
router.patch("/:id/status", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all", authMiddleware, adminOnly, async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
