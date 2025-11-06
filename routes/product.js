const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const validateProduct = require('../middleware/validateProduct');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../errors/errors');

// 🔹 In-memory product list (for demo)
const products = [
  {
    id: uuidv4(),
    name: 'Widget A',
    description: 'A useful widget',
    price: 9.99,
    category: 'tools',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Gadget B',
    description: 'A fancy gadget',
    price: 19.99,
    category: 'electronics',
    inStock: false
  }
];

// 🔸 Middleware: Require API key for all routes
router.use(auth);

// 🔹 GET /api/products — list products (with filtering & pagination)
router.get('/', asyncHandler((req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  let result = [...products];

  // filter by category
  if (category) {
    result = result.filter(p => p.category === category);
  }

  // pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;

  const paged = result.slice(start, end);
  res.json({ total: result.length, page: pageNum, limit: limitNum, data: paged });
}));

// 🔹 GET /api/products/search?q=term — search by name
router.get('/search', asyncHandler((req, res) => {
  const { q = '' } = req.query;
  const qLower = q.toLowerCase();
  const found = products.filter(p => p.name.toLowerCase().includes(qLower));
  res.json({ total: found.length, data: found });
}));

// 🔹 GET /api/products/stats — count by category
router.get('/stats', asyncHandler((req, res) => {
  const counts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  res.json({ total: products.length, countsByCategory: counts });
}));

// 🔹 GET /api/products/:id — get product by ID
router.get('/:id', asyncHandler((req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.json(product);
}));

// 🔹 POST /api/products — create new product
router.post('/', validateProduct, asyncHandler((req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price: Number(price),
    category,
    inStock: Boolean(inStock)
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
}));

// 🔹 PUT /api/products/:id — update product
router.put('/:id', validateProduct, asyncHandler((req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));

  const { name, description, price, category, inStock } = req.body;
  const updated = Object.assign(products[index], {
    name: name ?? products[index].name,
    description: description ?? products[index].description,
    price: price !== undefined ? Number(price) : products[index].price,
    category: category ?? products[index].category,
    inStock: inStock !== undefined ? Boolean(inStock) : products[index].inStock
  });

  res.json(updated);
}));

// 🔹 DELETE /api/products/:id — delete product
router.delete('/:id', asyncHandler((req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));
  const removed = products.splice(index, 1)[0];
  res.json({ message: 'Deleted', product: removed });
}));

module.exports = router;

