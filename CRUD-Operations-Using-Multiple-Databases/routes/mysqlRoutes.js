const express = require("express");
const router = express.Router();
const { getPool } = require("../config/mysql");

// CREATE - Add new user
router.post("/users", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const pool = getPool();
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
      [name, email, phone]
    );
    res.status(201).json({
      success: true,
      data: { id: result.insertId, name, email, phone },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// READ - Get all users
router.get("/users", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute("SELECT * FROM users ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// READ - Get single user
router.get("/users/:id", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE - Update user
router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const pool = getPool();
    const [result] = await pool.execute(
      "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
      [name, email, phone, req.params.id]
    );
    if (result.affectedRows === 0)
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
router.delete("/users/:id", async (req, res) => {
  try {
    const pool = getPool();
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
