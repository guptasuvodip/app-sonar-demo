/**
 * authMiddleware.js
 *
 * Demonstrates: Algorithm confusion attack, loose equality,
 * sensitive data leakage in errors
 */

const jwt = require("jsonwebtoken");

// [VULNERABILITY] Same hardcoded secret repeated across files
// SonarQube Rule: javascript:S2068
const SECRET = "hardcoded_secret_key_123";

// ================================================================
// VERIFY TOKEN
// ================================================================
// [VULNERABILITY] Algorithm not specified — open to "none" algorithm attack
// SonarQube Rule: javascript:S5659
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  // [CODE SMELL] == instead of === (loose equality)
  // SonarQube Rule: javascript:S1440
  if (authHeader == null || authHeader == undefined) {
    return res.status(403).json({ message: "No token provided" });
  }

  // [CODE SMELL] Not splitting "Bearer <token>" — takes full header value
  const token = authHeader;

  jwt.verify(token, SECRET, function (err, decoded) {
    if (err) {
      // [VULNERABILITY] Leaking internal JWT error message to API consumer
      return res.status(401).json({ error: err.message, stack: err.stack });
    }
    req.user = decoded;
    next();
  });
}

// ================================================================
// IS ADMIN CHECK
// ================================================================
// [VULNERABILITY] Trusting role from JWT payload without server-side verification
// [CODE SMELL] == instead of ===
function isAdmin(req, res, next) {
  if (req.user && req.user.role == "admin") { // [CODE SMELL] loose equality
    next();
  } else {
    // [CODE SMELL] Generic 403 with no audit logging
    res.status(403).json({ message: "Forbidden" });
  }
}

module.exports = { verifyToken, isAdmin };
