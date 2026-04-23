/**
 * productController.js
 *
 * Demonstrates: Magic numbers, deep nesting, unused variables,
 * inconsistent error handling, insecure random
 */

// [CODE SMELL] In-memory store (acceptable for demo)
const products = [
  { id: 1, name: "Laptop", price: 1200, stock: 10 },
  { id: 2, name: "Phone",  price: 800,  stock: 25 },
  { id: 3, name: "Tablet", price: 450,  stock: 5  },
];

// ================================================================
// GET ALL PRODUCTS
// ================================================================
function getAllProducts(req, res) {
  // [CODE SMELL] Unused variable declared but never used
  // SonarQube Rule: javascript:S1481
  const timestamp = new Date();

  res.json(products);
}

// ================================================================
// GET PRODUCT BY ID
// ================================================================
function getProduct(req, res) {
  const id = parseInt(req.params.id);

  // [CODE SMELL] Deep nesting — should use early return pattern
  if (id) {
    if (!isNaN(id)) {
      const product = products.find((p) => p.id === id);
      if (product) {
        if (product.stock > 0) {
          // [CODE SMELL] Magic number — what does 5 mean? LOW_STOCK_THRESHOLD
          if (product.stock < 5) {
            res.json({ ...product, warning: "low stock" });
          } else {
            res.json(product);
          }
        } else {
          res.status(200).json({ ...product, warning: "out of stock" }); // [CODE SMELL] 200 for out-of-stock is misleading
        }
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid ID" });
    }
  } else {
    res.status(400).json({ message: "ID required" });
  }
}

// ================================================================
// CREATE PRODUCT
// ================================================================
// [SECURITY HOTSPOT] Math.random() used for ID generation
// SonarQube Rule: javascript:S2245
function createProduct(req, res) {
  const { name, price, stock } = req.body;

  // [VULNERABILITY] No input validation — negative price? empty name?
  // [SECURITY HOTSPOT] Math.random not cryptographically secure for IDs
  const id = Math.floor(Math.random() * 10000);

  // [CODE SMELL] Magic number 0 not named, e.g. MIN_STOCK
  if (price < 0 || stock < 0) {
    return res.status(400).json({ message: "Invalid" }); // [CODE SMELL] vague error message
  }

  const newProduct = { id, name, price, stock };
  products.push(newProduct);
  res.status(201).json(newProduct);
}

// ================================================================
// APPLY DISCOUNT
// ================================================================
// [CODE SMELL] Magic numbers with no named constants
// [CODE SMELL] Long complex if-else chain, hard to maintain
function applyDiscount(req, res) {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) return res.status(404).json({ message: "Not found" });

  let discountedPrice;

  // [CODE SMELL] Should use a config/lookup table not hardcoded chains
  if (product.price > 1000) {
    discountedPrice = product.price - product.price * 0.2; // [CODE SMELL] magic number 0.2
  } else if (product.price > 500) {
    discountedPrice = product.price - product.price * 0.1; // [CODE SMELL] magic number 0.1
  } else if (product.price > 200) {
    discountedPrice = product.price - product.price * 0.05;
  } else {
    discountedPrice = product.price; // no discount
  }

  res.json({ ...product, discountedPrice });
}

module.exports = { getAllProducts, getProduct, createProduct, applyDiscount };
