// ============================================================================
//  app.js — Main Entry Point & Server Listener
//  Project : Mini Online Store API
// ============================================================================
//
// 🍽️  RESTAURANT ANALOGY — THE BIG PICTURE:
//
//   Think of this Express application as a **Restaurant**:
//
//   ┌──────────────────────────────────────────────────────────────────────┐
//   │  CUSTOMER  ──►  GREETER (logger)  ──►  BOUNCER (auth, VIP only)    │
//   │                                          │                          │
//   │            ┌─────────── MENU ────────────┤                          │
//   │            │                             │                          │
//   │      /products (public)            /users (VIP)                     │
//   │            │                             │                          │
//   │         CHEF 1                        CHEF 2                        │
//   │   (productController)           (userController)                    │
//   │            │                             │                          │
//   │            └──────── RESPONSE ───────────┘                          │
//   └──────────────────────────────────────────────────────────────────────┘
//
//   1. A customer (HTTP request) walks in.
//   2. The greeter (logger middleware) notes their arrival — applied globally.
//   3. If headed to the VIP lounge (/users), the bouncer (auth middleware)
//      checks for a valid token.  Public areas (/products) have no bouncer.
//   4. The waiter (route) takes the order to the correct chef (controller).
//   5. The chef prepares the dish (processes the data) and returns a response.
//   6. If the customer asks for something not on the menu → 404 handler.
//
// ============================================================================

// ──────────────────────────── 1. IMPORTS ────────────────────────────────────

const express = require('express');
const path    = require('path');

// Middleware
const logger = require('./middleware/logger');
const auth   = require('./middleware/auth');

// Routers
const productRoutes = require('./routes/products');
const userRoutes    = require('./routes/users');

// ──────────────────────────── 2. INITIALISE APP ─────────────────────────────

const app  = express();
const PORT = process.env.PORT || 3000;

// ──────────────────────────── 3. GLOBAL MIDDLEWARE ───────────────────────────

// 3a. Built-in body parser – allows us to read JSON payloads from req.body.
//     🍽️  Like a translator who converts the customer's spoken order into a
//         written ticket the chef can read.
app.use(express.json());

// 3b. Serve the frontend (static files from /public folder).
app.use(express.static(path.join(__dirname, 'public')));

// 3c. Custom Logger – applied to EVERY request (global / application-level).
//     🍽️  The front-door greeter who logs every visitor.
app.use(logger);

// ──────────────────────────── 4. MOUNT ROUTERS ──────────────────────────────

// 4a. Product routes — PUBLIC (no auth required)
//     All routes defined in routes/products.js are prefixed with "/products".
//     Example: router.get('/') inside products.js  →  GET /products
app.use('/products', productRoutes);

// 4b. User routes — PROTECTED (auth middleware runs before any user route)
//     🍽️  The bouncer (auth) stands at the VIP entrance (/users).
//     By passing `auth` as the FIRST handler before the router, Express will
//     execute auth for EVERY request that starts with /users.
app.use('/users', auth, userRoutes);

// ──────────────────────────── 5. ROOT ROUTE (Welcome) ───────────────────────

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🛒 Welcome to the Mini Online Store API!',
    endpoints: {
      products: 'GET  /products          — List all products (public)',
      userById: 'GET  /users/:id         — Get user by ID   (requires token)',
      createUser: 'POST /users            — Create a user    (requires token)',
    },
  });
});

// ──────────────────────────── 6. 404 HANDLER (Catch-All) ────────────────────
//
// 🍽️  RESTAURANT ANALOGY:
//   If a customer orders something that doesn't exist on the menu, the waiter
//   politely says "Sorry, we don't serve that."  This middleware catches any
//   request that didn't match a defined route above and responds with 404.
//
// ⚠️  This MUST be placed AFTER all other routes & routers.  Express
//     evaluates middleware/routes top-to-bottom; if nothing above matched,
//     execution falls through to here.
// ────────────────────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `🔍 Route not found: ${req.method} ${req.originalUrl}`,
    hint: 'Check the URL and HTTP method. Visit GET / for available endpoints.',
  });
});

// ──────────────────────────── 7. START SERVER ───────────────────────────────

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀  Mini Online Store API is running on http://localhost:${PORT}`);
  console.log('='.repeat(60));
  console.log('Available endpoints:');
  console.log(`  GET    http://localhost:${PORT}/products`);
  console.log(`  GET    http://localhost:${PORT}/users/:id   (token required)`);
  console.log(`  POST   http://localhost:${PORT}/users       (token required)`);
  console.log('='.repeat(60));
});
