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

// GET /products        — check cache first, then controller
router.get("/", cacheMiddleware, getProducts);

// GET /products/:id    — check cache first, then controller
router.get("/:id", cacheMiddleware, getProductById);

// POST /products       — create & invalidate cache
router.post("/", createProduct);

// PUT /products/:id    — full update & invalidate cache
router.put("/:id", updateProduct);

// PATCH /products/:id  — partial update & invalidate cache
router.patch("/:id", patchProduct);

// DELETE /products/:id — delete & invalidate cache
router.delete("/:id", deleteProduct);

module.exports = router;
