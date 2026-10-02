const { getAllProducts, writeAllProducts } = require("../database/db");

const TTL_MS = 60 * 1000; // 1 minute

// In-memory cache: { [key]: { data, createdAt } }
const cache = {};

function getCacheEntry(key) {
  const entry = cache[key];
  if (!entry) return null;

  const age = Date.now() - entry.createdAt;
  if (age > TTL_MS) {
    // Expired — delete and return null
    delete cache[key];
    return null;
  }

  return entry;
}

function setCacheEntry(key, data) {
  cache[key] = { data, createdAt: Date.now() };
}

function invalidateCache() {
  for (const key in cache) {
    delete cache[key];
  }
}

// Get all products
async function getAllProductsService() {
  return await getAllProducts();
}

// Get single product by id
async function getProductByIdService(id) {
  const products = await getAllProducts();
  const product = products.find((p) => p.id === Number(id));
  return product || null;
}

// Create a product
async function createProductService(body) {
  const products = await getAllProducts();
  const newProduct = { id: Date.now(), ...body };
  products.push(newProduct);
  await writeAllProducts(products);
  invalidateCache();
  return newProduct;
}

// Update (PUT) a product — full replace
async function updateProductService(id, body) {
  const products = await getAllProducts();
  const index = products.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  products[index] = { id: Number(id), ...body };
  await writeAllProducts(products);
  invalidateCache();
  return products[index];
}

// Patch a product — partial update
async function patchProductService(id, body) {
  const products = await getAllProducts();
  const index = products.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  products[index] = { ...products[index], ...body };
  await writeAllProducts(products);
  invalidateCache();
  return products[index];
}

// Delete a product
async function deleteProductService(id) {
  const products = await getAllProducts();
  const index = products.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  const deleted = products.splice(index, 1)[0];
  await writeAllProducts(products);
  invalidateCache();
  return deleted;
}

module.exports = {
  getCacheEntry,
  setCacheEntry,
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  patchProductService,
  deleteProductService,
};
