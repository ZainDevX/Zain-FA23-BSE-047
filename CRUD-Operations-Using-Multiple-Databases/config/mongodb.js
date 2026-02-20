const mongoose = require("mongoose");
require("dotenv").config();

let mongoConnected = false;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    mongoConnected = true;
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    mongoConnected = false;
    console.warn("⚠️  MongoDB not available — skipping. (Install & start MongoDB to enable it)");
  }
};

const isMongoConnected = () => mongoConnected;

// --- User Schema ---
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

const MongoUser = mongoose.model("User", userSchema);

module.exports = { connectMongoDB, MongoUser, isMongoConnected };
