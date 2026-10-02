const { getCacheEntry, setCacheEntry } = require("../services/productService");

function cacheMiddleware(req, res, next) {
  const key = (req.originalUrl || req.url).replace(/\/+$/, "") || "/";
  req.cacheKey = key;

  const entry = getCacheEntry(key);

  if (entry) {
    res.set("X-Cache", "HIT");
    return res.json(entry.data);
  }

  res.set("X-Cache", "MISS");

  const originalJson = res.json.bind(res);
  res.json = (data) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      setCacheEntry(key, data);
    }
    return originalJson(data);
  };

  next();
}

module.exports = { cacheMiddleware };
