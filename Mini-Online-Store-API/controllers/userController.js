// ============================================================================
// controllers/userController.js — Business Logic for Users
// ============================================================================
//
// 🍽️  RESTAURANT ANALOGY:
//   Another Chef in the kitchen — this one specialises in "user dishes".
//   When the waiter (router) receives an order related to users, it is
//   forwarded here.  The chef prepares the response and sends it back.
//
// 📐 MVC PATTERN:
//   Keeping product logic and user logic in separate controllers follows the
//   Single Responsibility Principle (SRP).  Each controller "owns" one
//   resource, making the codebase easier to maintain, test, and scale.
// ============================================================================

// ---------- Dummy Data (simulates a Model / Database) ----------
const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Smith',     email: 'bob@example.com',   role: 'customer' },
  { id: 3, name: 'Charlie Lee',   email: 'charlie@example.com', role: 'customer' },
];

// ---------- Controller Functions ----------

/**
 * getUserById — Fetches a single user by their ID (route parameter).
 *
 * HTTP:  GET /users/:id
 *
 * Demonstrates: req.params — Express automatically parses named segments
 * from the URL (e.g., /users/2  →  req.params.id === '2').
 */
const getUserById = (req, res) => {
  // req.params.id is always a string, so we convert it to a number
  const userId = parseInt(req.params.id, 10);

  // Search the dummy data for a matching user
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.status(200).json({
      success: true,
      data: user,
    });
  } else {
    // User not found — return 404
    res.status(404).json({
      success: false,
      message: `User with ID ${userId} not found.`,
    });
  }
};

/**
 * createUser — Accepts user data from the request body and "creates" a user.
 *
 * HTTP:  POST /users
 *
 * Demonstrates: req.body — Express parses the JSON payload sent by the
 * client (thanks to the built-in `express.json()` middleware in app.js).
 */
const createUser = (req, res) => {
  // Destructure expected fields from the request body
  const { name, email, role } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error – "name" and "email" are required fields.',
    });
  }

  // Build the new user object (simulate auto-increment ID)
  const newUser = {
    id: users.length + 1,
    name,
    email,
    role: role || 'customer', // default role
  };

  // Push into our in-memory array (in production: save to database)
  users.push(newUser);

  // Respond with 201 Created
  res.status(201).json({
    success: true,
    message: 'User created successfully.',
    data: newUser,
  });
};

// Export all controller functions so routes can import them
module.exports = {
  getUserById,
  createUser,
};
