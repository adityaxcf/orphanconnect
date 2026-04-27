const express    = require("express");
const router     = express.Router();
const Orphanage  = require("../models/Orphanage");
const User       = require("../models/User");
const { authMiddleware, adminOnly, ownerOnly } = require("../middleware/auth");

// GET all approved orphanages (public)
router.get("/", async (req, res) => {
  try {
    const orphanages = await Orphanage.find({ status: "approved" });
    res.json(orphanages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ FIX: /admin/all MUST come BEFORE /:id or Express matches "admin" as an ID
router.get("/admin/all", authMiddleware, adminOnly, async (req, res) => {
  try {
    const orphanages = await Orphanage.find();
    res.json(orphanages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single orphanage by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const orphanage = await Orphanage.findById(req.params.id);
    if (!orphanage) return res.status(404).json({ error: "Orphanage not found." });
    res.json(orphanage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH approve or reject orphanage (admin only)
router.patch("/:id/status", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const orphanage = await Orphanage.findByIdAndUpdate(req.params.id, { status }, { new: true });
    await User.findOneAndUpdate({ orphanageId: req.params.id }, { status: status === "approved" ? "active" : status });
    res.json(orphanage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update orphanage details (owner — own orphanage only)
router.patch("/:id", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const orphanage = await Orphanage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(orphanage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
