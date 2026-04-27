const express  = require("express");
const router   = express.Router();
const Child    = require("../models/Child");
const { authMiddleware, ownerOnly } = require("../middleware/auth");

// GET children for an orphanage (public)
router.get("/:orphanageId", async (req, res) => {
  try {
    const children = await Child.find({ orphanageId: req.params.orphanageId, available: true });
    res.json(children);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add a child (owner only)
router.post("/", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const child = await Child.create(req.body);
    res.json(child);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH mark child as unavailable (owner only)
router.patch("/:id/unavailable", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const child = await Child.findByIdAndUpdate(req.params.id, { available: false }, { new: true });
    res.json(child);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
