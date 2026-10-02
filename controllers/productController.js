const {
  setCacheEntry,
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  patchProductService,
  deleteProductService,
} = require("../services/productService");

async function getProducts(req, res) {
  try {
    const key = req.cacheKey || (req.originalUrl || req.url).replace(/\/+$/, "") || "/";
    const products = await getAllProductsService();
    setCacheEntry(key, products);
    res.set("X-Cache", "MISS");
    return res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to read products" });
  }
}

async function getProductById(req, res) {
  try {
    const key = req.cacheKey || (req.originalUrl || req.url).replace(/\/+$/, "") || "/";
    const { id } = req.params;

    const product = await getProductByIdService(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    setCacheEntry(key, product);
    res.set("X-Cache", "MISS");
    return res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to read product" });
  }
}

async function createProduct(req, res) {
  try {
    const newProduct = await createProductService(req.body);
    return res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create product" });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updated = await updateProductService(id, req.body);
    if (!updated) return res.status(404).json({ message: "Product not found" });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to update product" });
  }
}

async function patchProduct(req, res) {
  try {
    const { id } = req.params;
    const patched = await patchProductService(id, req.body);
    if (!patched) return res.status(404).json({ message: "Product not found" });
    return res.json(patched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to patch product" });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const deleted = await deleteProductService(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Product deleted", product: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to delete product" });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
};
