const mongoose = require("mongoose");

const orphanageSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  about:      { type: String, required: true },
  address:    { type: String, required: true },
  established:{ type: String, default: "" },
  capacity:   { type: Number, required: true },
  occupied:   { type: Number, required: true },
  vacant:     { type: Number, required: true },
  facilities: [{ type: String }],
  mapLink:    { type: String, default: "" },
  ownerName:  { type: String, required: true },
  ownerEmail: { type: String, required: true },
  ownerPhone: { type: String, required: true },
  ownerId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Orphanage", orphanageSchema);
