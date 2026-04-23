const express = require("express");
const router  = express.Router();
const { getAllProducts, getProduct, createProduct, applyDiscount } = require("../controllers/Productcontroller");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/",                      getAllProducts);
router.get("/:id",                   getProduct);
router.post("/",        verifyToken, createProduct);
router.post("/:id/discount", verifyToken, applyDiscount);

module.exports = router;
