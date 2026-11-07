require("dotenv").config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 characters.");
}
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not configured.");
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/orphanages", require("./routes/orphanages"));
app.use("/api/tickets", require("./routes/tickets"));
app.use("/api/children", require("./routes/children"));
app.use("/api/payment", require("./routes/payment"));

app.get("/", (req, res) => res.json({ message: "OrphanConnect API is running!" }));

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
