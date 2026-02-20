const express = require("express");
const router = express.Router();
const { MongoUser, isMongoConnected } = require("../config/mongodb");

// Middleware: check if MongoDB is available
router.use((req, res, next) => {
  if (!isMongoConnected()) {
    return res.status(503).json({
      success: false,
      message: "MongoDB is not running. Please install & start MongoDB, then restart the server.",
    });
  }
  next();
});

// CREATE - Add new user
router.post("/users", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = new MongoUser({ name, email, phone });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// READ - Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await MongoUser.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// READ - Get single user
router.get("/users/:id", async (req, res) => {
  try {
    const user = await MongoUser.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE - Update user
router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await MongoUser.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE - Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await MongoUser.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
