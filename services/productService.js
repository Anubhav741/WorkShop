const { getAllProducts, writeAllProducts } = require("../database/db");

const TTL_MS = 60 * 1000;

const cache = {};

function getCacheEntry(key) {
  const entry = cache[key];
  if (!entry) return null;

  const age = Date.now() - entry.createdAt;
  if (age > TTL_MS) {
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

async function getAllProductsService() {
  return await getAllProducts();
}

async function getProductByIdService(id) {
  const products = await getAllProducts();
  const product = products.find((p) => Number(p.id) === Number(id));
  return product || null;
}

async function createProductService(body) {
  const products = await getAllProducts();
  const id = body.id !== undefined ? Number(body.id) : Date.now();
  const newProduct = { ...body, id };
  products.push(newProduct);
  await writeAllProducts(products);
  invalidateCache();
  return newProduct;
}

async function updateProductService(id, body) {
  const products = await getAllProducts();
  const index = products.findIndex((p) => Number(p.id) === Number(id));
  if (index === -1) return null;
  products[index] = { ...body, id: Number(id) };
  await writeAllProducts(products);
  invalidateCache();
  return products[index];
}

async function patchProductService(id, body) {
  const products = await getAllProducts();
  const index = products.findIndex((p) => Number(p.id) === Number(id));
  if (index === -1) return null;
  products[index] = { ...products[index], ...body, id: Number(id) };
  await writeAllProducts(products);
  invalidateCache();
  return products[index];
}

async function deleteProductService(id) {
  const products = await getAllProducts();
  const index = products.findIndex((p) => Number(p.id) === Number(id));
  if (index === -1) return null;
  const deleted = products.splice(index, 1)[0];
  await writeAllProducts(products);
  invalidateCache();
  return deleted;
}

module.exports = {
  getCacheEntry,
  setCacheEntry,
  invalidateCache,
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  patchProductService,
  deleteProductService,
};
