const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
} = require("../controllers/productController");

const { cacheMiddleware } = require("../middleware/cacheMiddleware");

router.get("/", cacheMiddleware, getProducts);
router.get("/:id", cacheMiddleware, getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.patch("/:id", patchProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
