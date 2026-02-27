// ============================================================================
// routes/products.js — Product Routes (Express Router)
// ============================================================================
//
// 🍽️  RESTAURANT ANALOGY:
//   The Router is like the **Menu Section**.  A restaurant doesn't list every
//   dish on one giant page — it organises them into sections: Appetizers,
//   Main Course, Desserts, etc.  Similarly, express.Router() lets us group
//   related endpoints into their own module.
//
// 📐 WHY express.Router() INSTEAD OF PUTTING ALL ROUTES IN app.js?
//   1. Clean Code    — app.js stays small; it only mounts routers.
//   2. Scalability   — Adding a new resource (e.g., /orders) means creating
//                      a new route file, not editing a monolithic app.js.
//   3. Team-Friendly — Multiple developers can work on different route files
//                      without merge conflicts.
//   4. Reusability   — A router module can be mounted at different base paths
//                      or even shared across projects.
// ============================================================================

const express = require('express');

// Create a new Router instance — this is a "mini-app" capable of
// handling its own middleware and routes.
const router = express.Router();

// Import the controller that contains the business logic for products
const productController = require('../controllers/productController');

// --------- Define Routes ---------

// GET /products  →  Returns all products
//   The controller function is the "chef" that prepares the response.
//   The route simply maps the HTTP verb + path to the correct controller.
router.get('/', productController.getAllProducts);

// --------- Export the Router ---------
// This router will be mounted in app.js at the base path "/products".
// So `router.get('/')` here actually handles  GET /products.
module.exports = router;
