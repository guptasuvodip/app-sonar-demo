const express    = require("express");
const router     = express.Router();
const { register, login, getProfile, deleteUser } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/register",                 register);
router.post("/login",                    login);
router.get("/profile",    verifyToken,   getProfile);
router.delete("/user/:username", verifyToken, deleteUser);

module.exports = router;
