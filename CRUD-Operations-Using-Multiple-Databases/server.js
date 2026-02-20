const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { connectMongoDB } = require("./config/mongodb");
const { connectMySQL } = require("./config/mysql");
const { connectSQLite } = require("./config/sqlite");

const mongoRoutes = require("./routes/mongoRoutes");
const mysqlRoutes = require("./routes/mysqlRoutes");
const sqliteRoutes = require("./routes/sqliteRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/mongo", mongoRoutes);
app.use("/api/mysql", mysqlRoutes);
app.use("/api/sqlite", sqliteRoutes);

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Initialize databases and start server
const startServer = async () => {
  // Connect to all databases (each is independent — one failing won't stop others)
  await connectMongoDB();
  await connectMySQL();
  connectSQLite();

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 MongoDB CRUD  → http://localhost:${PORT}/mongo.html`);
    console.log(`📁 MySQL CRUD    → http://localhost:${PORT}/mysql.html`);
    console.log(`📁 SQLite CRUD   → http://localhost:${PORT}/sqlite.html\n`);
  });
};

startServer();
