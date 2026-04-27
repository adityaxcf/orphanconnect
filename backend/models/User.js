const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  phone:     { type: String, default: "" },
  role:      { type: String, enum: ["user", "owner", "admin"], default: "user" },
  status:    { type: String, enum: ["active", "pending", "rejected"], default: "active" },
  orphanageId: { type: mongoose.Schema.Types.ObjectId, ref: "Orphanage", default: null }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
