const express = require("express");
const router = express.Router();
const { getDB } = require("../config/sqlite");

// CREATE - Add new user
router.post("/users", (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const db = getDB();
    const stmt = db.prepare("INSERT INTO users (name, email, phone) VALUES (?, ?, ?)");
    const result = stmt.run(name, email, phone);
    res.status(201).json({
      success: true,
      data: { id: result.lastInsertRowid, name, email, phone },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// READ - Get all users
router.get("/users", (req, res) => {
  try {
    const db = getDB();
    const users = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// READ - Get single user
router.get("/users/:id", (req, res) => {
  try {
    const db = getDB();
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE - Update user
router.put("/users/:id", (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const db = getDB();
    const stmt = db.prepare(
      "UPDATE users SET name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    );
    const result = stmt.run(name, email, phone, req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ success: false, message: "User not found" });
    res.json({
      success: true,
      data: { id: parseInt(req.params.id), name, email, phone },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE - Delete user
router.delete("/users/:id", (req, res) => {
  try {
    const db = getDB();
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    const result = stmt.run(req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
