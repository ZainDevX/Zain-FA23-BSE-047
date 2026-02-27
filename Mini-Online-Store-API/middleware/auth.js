// ============================================================================
// middleware/auth.js — Simulated Authentication Middleware
// ============================================================================
//
// 🍽️  RESTAURANT ANALOGY:
//   This middleware is the **Bouncer / VIP Check** at the restaurant.
//   While the greeter (logger) lets everyone through, the bouncer stands
//   in front of the VIP lounge (/users routes) and checks whether the
//   customer has a valid VIP pass (authorization token).
//
//   • If the token is present  → "Welcome in!" → next()
//   • If the token is missing  → "Sorry, you can't enter." → 401 response
//
// 📐 SCALABLE ARCHITECTURE NOTE:
//   This middleware is NOT applied globally.  It is mounted only on the
//   /users router (Router-level middleware), keeping public routes like
//   /products completely open. This selective application keeps security
//   concerns modular and easy to manage.
// ============================================================================

/**
 * auth – Simulates token-based authentication.
 *
 * In a real-world app this would verify a JWT or session cookie.
 * Here we simply check for the existence of an `authorization` header.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const auth = (req, res, next) => {
  // Read the "authorization" header from the incoming request
  const token = req.headers['authorization'];

  // --- Simulate token validation ---
  if (token) {
    // Token exists — let the request proceed to the route handler
    console.log('[AUTH] ✅ Token received — access granted.');
    next();
  } else {
    // No token — block the request and send a 401 Unauthorized response
    console.log('[AUTH] ❌ No token provided — access denied.');
    res.status(401).json({
      success: false,
      message:
        'Unauthorized – Please provide a valid token in the Authorization header.',
    });
    // Notice: we do NOT call next() here.  The request stops at the bouncer.
  }
};

module.exports = auth;
