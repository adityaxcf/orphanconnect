const { authMiddleware, adminOnly } = require("../middleware/auth");
const express = require("express");
const router  = express.Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const Orphanage = require("../models/Orphanage");

// ── Register User ─────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: "user" });

    const token = jwt.sign({ id: user._id, role: user.role, orphanageId: user.orphanageId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Register Orphanage Owner (Step 1) ─────────────────────────
router.post("/register-owner", async (req, res) => {
  try {
    const { name, email, password, phone, orphanage } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered." });

    const hashed = await bcrypt.hash(password, 10);

    // Create orphanage as pending
    const newOrphanage = await Orphanage.create({
      ...orphanage,
      ownerName:  name,
      ownerEmail: email,
      ownerPhone: phone,
      status: "pending"
    });

    // Create owner user as pending
    const user = await User.create({
      name, email, password: hashed, phone,
      role: "owner", status: "pending",
      orphanageId: newOrphanage._id
    });

    // Link owner to orphanage
    newOrphanage.ownerId = user._id;
    await newOrphanage.save();

    res.json({ message: "Registration submitted for admin approval." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Login ──────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded admin
    if (email === "admin@orphanconnect.com" && password === "admin123") {
      const token = jwt.sign({ id: "admin", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token, user: { id: "admin", name: "Admin", email, role: "admin" } });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "No account found. Please register first." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Incorrect password." });

    if (user.role === "owner" && user.status === "pending")
      return res.status(403).json({ error: "Your registration is pending admin approval." });
    if (user.role === "owner" && user.status === "rejected")
      return res.status(403).json({ error: "Your registration was rejected by the admin." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, orphanageId: user.orphanageId } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all-users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
