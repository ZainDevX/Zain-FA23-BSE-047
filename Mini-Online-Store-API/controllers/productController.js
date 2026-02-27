// ============================================================================
// controllers/productController.js — Business Logic for Products
// ============================================================================
//
// 🍽️  RESTAURANT ANALOGY:
//   The Controller is the **Kitchen Chef**.  The waiter (route) takes the
//   customer's order and passes it to the chef.  The chef prepares the meal
//   (processes the request) and hands the finished dish (response) back to
//   the waiter to deliver to the customer.
//
//   Separating business logic into controllers means:
//     • Routes stay thin — they only describe WHAT endpoint exists.
//     • Controllers handle HOW the work is done.
//     • If the recipe (logic) changes, we update the chef — not the menu.
//
// 📐 MVC PATTERN:
//   Model      → Data layer (here we use a dummy array; in production this
//                 would be a database model via Mongoose, Sequelize, etc.)
//   View       → In an API the "view" is the JSON response sent to the client.
//   Controller → This file — orchestrates data retrieval and response.
// ============================================================================

// ---------- Dummy Data (simulates a Model / Database) ----------
const products = [
  { id: 1, name: 'Wireless Mouse',       price: 25.99, category: 'Electronics' },
  { id: 2, name: 'Mechanical Keyboard',  price: 79.99, category: 'Electronics' },
  { id: 3, name: 'USB-C Hub',            price: 34.50, category: 'Accessories' },
  { id: 4, name: 'Laptop Stand',         price: 45.00, category: 'Accessories' },
  { id: 5, name: 'Noise-Cancelling Headphones', price: 199.99, category: 'Audio' },
];

// ---------- Controller Functions ----------

/**
 * getAllProducts — Returns the full list of products.
 *
 * HTTP:  GET /products
 */
const getAllProducts = (req, res) => {
  // In a real app this would query the database.
  // Here we simply return our in-memory array.
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
};

// Export all controller functions so routes can import them
module.exports = {
  getAllProducts,
};
