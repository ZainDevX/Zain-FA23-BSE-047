// ============================================================================
// routes/users.js — User Routes (Express Router)
// ============================================================================
//
// 🍽️  RESTAURANT ANALOGY:
//   This is another section of the menu — the "VIP Section".  Unlike the
//   products menu which is open to everyone, this section is protected by
//   the bouncer (auth middleware) who checks for a valid token before
//   letting anyone in.
//
// 📐 WHY express.Router() INSTEAD OF PUTTING ALL ROUTES IN app.js?
//   1. Separation of Concerns — Each resource has its own routing module.
//   2. Router-Level Middleware — We can apply auth ONLY to user routes
//      without affecting product routes (see app.js where auth is mounted).
//   3. Maintainability — Easier to read, test, and debug small focused files.
// ============================================================================

const express = require('express');

// Create a new Router instance for user-related endpoints
const router = express.Router();

// Import the controller that contains the business logic for users
const userController = require('../controllers/userController');

// --------- Define Routes ---------

// GET /users/:id  →  Fetch a specific user by ID
//   :id is a Route Parameter — Express captures the value from the URL
//   and makes it available via req.params.id inside the controller.
//   Example: GET /users/2  →  req.params.id === '2'
router.get('/:id', userController.getUserById);

// POST /users  →  Create a new user
//   The client sends a JSON body with the user data.
//   express.json() middleware (applied globally in app.js) parses the body
//   and makes it available via req.body inside the controller.
router.post('/', userController.createUser);

// --------- Export the Router ---------
// This router will be mounted in app.js at the base path "/users".
// So `router.get('/:id')` here actually handles  GET /users/:id.
module.exports = router;
