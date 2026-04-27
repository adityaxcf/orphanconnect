const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  orphanageId: { type: mongoose.Schema.Types.ObjectId, ref: "Orphanage", required: true },
  name:        { type: String, required: true },
  age:         { type: Number, required: true },
  gender:      { type: String, enum: ["boy", "girl"], required: true },
  about:       { type: String, required: true },
  tags:        [{ type: String }],
  available:   { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Child", childSchema);
