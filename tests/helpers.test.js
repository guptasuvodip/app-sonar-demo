const { generateOTP, validateEmail, parseJSON } = require("../src/utils/helpers");

describe("generateOTP", () => {
  test("returns a 4-digit number", () => {
    const otp = generateOTP();
    expect(otp).toBeGreaterThanOrEqual(1000);
    expect(otp).toBeLessThanOrEqual(9999);
  });
});

describe("validateEmail", () => {
  test("valid email returns true", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });
  test("invalid email returns false", () => {
    expect(validateEmail("notanemail")).toBe(false);
  });
});

describe("parseJSON", () => {
  test("parses valid JSON", () => {
    expect(parseJSON('{"key":"value"}')).toEqual({ key: "value" });
  });
  test("returns undefined for bad input silently", () => {
    expect(parseJSON("invalid")).toBeUndefined();
  });
});
