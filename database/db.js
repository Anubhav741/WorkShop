const fs = require("fs").promises;
const path = require("path");

const pathToFile = path.join(__dirname, "../db.json");

async function getAllProducts() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const data = await fs.readFile(pathToFile, "utf-8");
  return JSON.parse(data);
}

async function writeAllProducts(products) {
  await fs.writeFile(pathToFile, JSON.stringify(products, null, 2), "utf-8");
}

module.exports = { getAllProducts, writeAllProducts };
