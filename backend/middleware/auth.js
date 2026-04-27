const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token provided." });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admins only." });
  next();
}

function ownerOnly(req, res, next) {
  if (req.user.role !== "owner" && req.user.role !== "admin") return res.status(403).json({ error: "Owners only." });
  next();
}

module.exports = { authMiddleware, adminOnly, ownerOnly };
