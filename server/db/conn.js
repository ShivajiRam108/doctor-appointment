const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

const uri = process.env.MONGO_URI;

if (!uri || !uri.startsWith("mongodb")) {
  console.error("❌ Invalid or missing MONGO_URI in .env file.");
  process.exit(1);
}

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // ✅ Recommended
  })
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Stop the app if DB connection fails
  });
