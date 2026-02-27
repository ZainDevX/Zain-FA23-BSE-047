// ============================================================================
// middleware/logger.js — Global Request Logger
// ============================================================================
//
// 🍽️  RESTAURANT ANALOGY:
//   Think of this middleware as the **Front-Door Greeter** of a restaurant.
//   Every single customer (HTTP request) that walks in is greeted and their
//   arrival time is noted in a log book — regardless of which table (route)
//   they are headed to.  The greeter doesn't stop anyone; they simply record
//   the visit and wave the customer through with `next()`.
//
// 📐 WHY A SEPARATE FILE?
//   Keeping middleware in its own file follows the Scalable Application
//   Architecture principle.  If we ever need to swap to a production-grade
//   logging library (e.g., Morgan, Winston), we only touch THIS file —
//   no changes needed in app.js or any route.
// ============================================================================

/**
 * logger – Logs the HTTP method, URL and timestamp of every incoming request.
 *
 * @param {import('express').Request}  req  - Express request object
 * @param {import('express').Response} res  - Express response object
 * @param {import('express').NextFunction} next - Passes control to the next middleware / route handler
 */
const logger = (req, res, next) => {
  // Build a human-readable timestamp
  const timestamp = new Date().toISOString();

  // Log request details to the console
  console.log(`[LOG] ${timestamp}  ➜  ${req.method} ${req.url}`);

  // 🔑 CRITICAL: Always call next() so the request continues down the chain.
  //    Without next(), the request would hang here forever — like a greeter
  //    who never lets customers past the door!
  next();
};

module.exports = logger;
