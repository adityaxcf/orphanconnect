require("dotenv").config();
const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth",       require("./routes/auth"));
app.use("/api/orphanages", require("./routes/orphanages"));
app.use("/api/tickets",    require("./routes/tickets"));
app.use("/api/children",   require("./routes/children"));
app.use("/api/payment",    require("./routes/payment"));

// Health check
app.get("/", (req, res) => res.json({ message: "OrphanConnect API is running!" }));

// ✅ FIX: hardcoded to 3001 to match all frontend fetch calls
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log("🚀 Server running on http://localhost:" + PORT);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
