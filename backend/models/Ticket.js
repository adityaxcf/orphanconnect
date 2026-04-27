const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName:     { type: String, required: true },
  userEmail:    { type: String, required: true },
  userPhone:    { type: String, required: true },
  orphanageId:  { type: mongoose.Schema.Types.ObjectId, ref: "Orphanage", required: true },
  orphanageName:{ type: String, required: true },
  type:         { type: String, enum: ["donate", "volunteer", "adopt", "adopt-final"], required: true },
  status:       { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

  // Donate fields
  donationType: { type: String, default: "" },
  amount:       { type: Number, default: 0 },
  paymentId:    { type: String, default: "" },
  message:      { type: String, default: "" },

  // Volunteer fields
  age:          { type: Number, default: null },
  availability: { type: String, default: "" },
  helpType:     { type: String, default: "" },

  // Adopt fields
  marital:      { type: String, default: "" },
  occupation:   { type: String, default: "" },
  city:         { type: String, default: "" },
  agePref:      { type: String, default: "" },
  reason:       { type: String, default: "" },

  // Adopt-final fields
  childId:      { type: mongoose.Schema.Types.ObjectId, ref: "Child", default: null },
  childName:    { type: String, default: "" }

}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
