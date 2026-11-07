const { authMiddleware, adminOnly } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Orphanage = require("../models/Orphanage");

// Admin credentials are configured only on the server:
// ADMIN_EMAIL and ADMIN_PASSWORD_HASH (a bcrypt hash).
function signToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// ── Register User ─────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ error: "Name, email and a password of at least 8 characters are required." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ error: "Email already registered." });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashed, role: "user" });

    const token = signToken({ id: user._id, role: user.role, orphanageId: user.orphanageId });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Registration failed." });
  }
});

// ── Register Orphanage Owner (Step 1) ─────────────────────────
router.post("/register-owner", async (req, res) => {
  try {
    const { name, email, password, phone, orphanage } = req.body;
    if (!name || !email || !password || password.length < 8 || !orphanage || typeof orphanage !== "object") {
      return res.status(400).json({ error: "Valid owner details, password and orphanage details are required." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ error: "Email already registered." });

    const hashed = await bcrypt.hash(password, 12);
    const newOrphanage = await Orphanage.create({
      ...orphanage,
      ownerName: name.trim(),
      ownerEmail: normalizedEmail,
      ownerPhone: phone,
      status: "pending"
    });

    const user = await User.create({
      name: name.trim(), email: normalizedEmail, password: hashed, phone,
      role: "owner", status: "pending", orphanageId: newOrphanage._id
    });

    newOrphanage.ownerId = user._id;
    await newOrphanage.save();

    res.json({ message: "Registration submitted for admin approval." });
  } catch (err) {
    res.status(500).json({ error: "Owner registration failed." });
  }
});

// ── Login ──────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (adminEmail && adminPasswordHash && normalizedEmail === adminEmail &&
        await bcrypt.compare(password, adminPasswordHash)) {
      const token = signToken({ id: "admin", role: "admin" });
      return res.json({ token, user: { id: "admin", name: "Admin", email: adminEmail, role: "admin" } });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ error: "No account found. Please register first." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Incorrect password." });

    if (user.role === "owner" && user.status === "pending")
      return res.status(403).json({ error: "Your registration is pending admin approval." });
    if (user.role === "owner" && user.status === "rejected")
      return res.status(403).json({ error: "Your registration was rejected by the admin." });

    const token = signToken({ id: user._id, role: user.role, orphanageId: user.orphanageId });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, orphanageId: user.orphanageId } });
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
});

router.get("/all-users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Unable to retrieve users." });
  }
});

module.exports = router;
