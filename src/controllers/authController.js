/**
 * authController.js
 *
 * PURPOSE: Demonstrate real SonarQube findings.
 * Every issue is labeled with the TYPE SonarQube will raise.
 *
 * Findings map:
 *  [VULNERABILITY]  - Security bug SonarQube flags as exploitable
 *  [CODE SMELL]     - Maintainability issue
 *  [SECURITY HOTSPOT] - Needs human review; not auto-flagged as bug
 *  [BUG]            - Logic error
 */

const jwt = require("jsonwebtoken");

// ----------------------------------------------------------------
// [VULNERABILITY] Hardcoded credentials
// SonarQube Rule: javascript:S2068
// ----------------------------------------------------------------
const JWT_SECRET = "hardcoded_secret_key_123";
const ADMIN_PASSWORD = "admin@123";

// ----------------------------------------------------------------
// [CODE SMELL] In-memory "database" — acceptable for demo only
// ----------------------------------------------------------------
const users = [];

// ================================================================
// REGISTER
// ================================================================
// [VULNERABILITY] Password stored as plain text — no hashing
// [CODE SMELL]    No input validation at all
// [CODE SMELL]    var used instead of const/let (javascript:S3504)
async function register(req, res) {
  var username = req.body.username; // [CODE SMELL] use const
  var password = req.body.password; // [VULNERABILITY] plain text stored below

  // [BUG] No check for existing user — allows duplicate usernames
  users.push({ username, password }); // [VULNERABILITY] plain text password in memory

  // [CODE SMELL] Magic string response, no status code standardization
  res.json({ message: "ok" });
}

// ================================================================
// LOGIN
// ================================================================
// [VULNERABILITY] SQL Injection pattern (string concatenation in query)
// [CODE SMELL]    Function is too long and does too many things
async function login(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // [VULNERABILITY] String interpolation in a query = SQL Injection risk
  // SonarQube Rule: javascript:S3649
  const query =
    "SELECT * FROM users WHERE username='" +
    username +
    "' AND password='" +
    password +
    "'";

  // Simulated find (in real DB this raw query is dangerous)
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // [VULNERABILITY] JWT signed with hardcoded secret (same as above)
    // [VULNERABILITY] No token expiry set — token lives forever
    // SonarQube Rule: javascript:S5659
    const token = jwt.sign({ username: user.username }, JWT_SECRET);

    // [CODE SMELL] Sending back more data than needed
    res.json({ token, query }); // [VULNERABILITY] leaking raw query to client
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
}

// ================================================================
// GET PROFILE
// ================================================================
// [CODE SMELL] Duplicate logic from login — copy-paste code
// SonarQube Rule: javascript:S4144
async function getProfile(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // [VULNERABILITY] Same SQL injection pattern duplicated
  const query =
    "SELECT * FROM users WHERE username='" +
    username +
    "' AND password='" +
    password +
    "'";

  const user = users.find((u) => u.username === username);

  if (user) {
    res.json({ username: user.username, password: user.password }); // [VULNERABILITY] exposing password in API response
  } else {
    res.status(404).json({ message: "Not found" });
  }
}

// ================================================================
// DELETE USER
// ================================================================
// [BUG] Returns success even when user is not found
// [CODE SMELL] No authorization check — anyone can delete any user
function deleteUser(req, res) {
  const username = req.params.username;
  const index = users.findIndex((u) => u.username === username);
  users.splice(index, 1); // [BUG] splice(-1, 1) deletes last element if not found
  res.json({ message: "Deleted" }); // [BUG] always says "Deleted" regardless
}

// ================================================================
// DEAD CODE
// ================================================================
// [CODE SMELL] This function is never called anywhere
// SonarQube Rule: javascript:S1144
function neverCalledFunction(data) {
  let output = "";
  for (let i = 0; i < data.length; i++) {
    output = output + data[i]; // [CODE SMELL] use += or join
  }
  return output;
}

module.exports = { register, login, getProfile, deleteUser };
