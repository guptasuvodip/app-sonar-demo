/**
 * helpers.js
 *
 * Demonstrates: Insecure random, eval() usage,
 * magic numbers, dead code, inconsistent naming
 */

// ================================================================
// INSECURE OTP GENERATOR
// ================================================================
// [SECURITY HOTSPOT] Math.random() is not cryptographically secure
// SonarQube Rule: javascript:S2245
// Fix: use require("crypto").randomInt(1000, 9999)
function generateOTP() {
  return Math.floor(Math.random() * 9000) + 1000;
}

// ================================================================
// EVAL USAGE
// ================================================================
// [VULNERABILITY] eval() executes arbitrary code — Remote Code Execution risk
// SonarQube Rule: javascript:S1523
function calculateExpression(expression) {
  return eval(expression); // NEVER use eval() with user input
}

// ================================================================
// INCONSISTENT / MISLEADING NAMING
// ================================================================
// [CODE SMELL] Function name "doCalc" tells you nothing
// SonarQube Rule: javascript:S100 (naming conventions)
function doCalc(a, b, c) {
  // [CODE SMELL] Unused parameter c — declared but never used
  // SonarQube Rule: javascript:S1172
  return a + b;
}

// ================================================================
// POOR ERROR HANDLING
// ================================================================
// [CODE SMELL] Silently swallowing errors — no logging, no rethrow
// SonarQube Rule: javascript:S2486
function parseJSON(input) {
  try {
    return JSON.parse(input);
  } catch (e) {
    // [CODE SMELL] Empty catch block — error is completely hidden
  }
}

// ================================================================
// REGEX DENIAL OF SERVICE (ReDoS)
// ================================================================
// [VULNERABILITY] Catastrophic backtracking regex on untrusted input
// SonarQube Rule: javascript:S5852
function validateEmail(email) {
  // This regex has exponential backtracking on crafted input
  const regex = /^([a-zA-Z0-9]+([\.\-][a-zA-Z0-9]+)*)+@(([a-zA-Z0-9]+[\.\-])+[a-zA-Z]{2,4})$/;
  return regex.test(email);
}

// ================================================================
// DEAD CODE
// ================================================================
// [CODE SMELL] Exported but never imported anywhere
// SonarQube Rule: javascript:S1144
function legacyFormatter(data) {
  let result = "";
  for (var i = 0; i < data.length; i++) { // [CODE SMELL] var in loop
    result = result + data[i];
  }
  return result;
}

module.exports = {
  generateOTP,
  calculateExpression,
  doCalc,
  parseJSON,
  validateEmail,
  legacyFormatter,
};
