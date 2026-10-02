const { getCacheEntry } = require("../services/productService");

/**
 * Cache middleware for GET requests.
 *
 * - Attaches `req.cacheKey` (the request URL) so controllers can write back to cache.
 * - If a valid (non-expired) cache entry exists, responds immediately with X-Cache: HIT.
 * - Otherwise calls next() so the controller fetches fresh data and sets X-Cache: MISS.
 */
function cacheMiddleware(req, res, next) {
  const key = req.url;
  req.cacheKey = key;

  const entry = getCacheEntry(key);

  if (entry) {
    console.log(`[Cache HIT] ${key}`);
    res.set("X-Cache", "HIT");
    return res.json(entry.data);
  }

  console.log(`[Cache MISS] ${key}`);
  next();
}

module.exports = { cacheMiddleware };
