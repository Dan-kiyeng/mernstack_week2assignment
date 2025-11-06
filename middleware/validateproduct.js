const { ValidationError } = require('../errors/errors');


module.exports = (req, res, next) => {
const { name, description, price, category, inStock } = req.body;
const errors = [];


if (req.method === 'POST' || name !== undefined) {
if (!name || typeof name !== 'string' || name.trim().length < 2) {
errors.push('name is required and must be at least 2 characters');
}
}


if (req.method === 'POST' || description !== undefined) {
if (!description || typeof description !== 'string') {
errors.push('description is required and must be a string');
}
}


if (req.method === 'POST' || price !== undefined) {
if (price === undefined || Number.isNaN(Number(price)) || Number(price) < 0) {
errors.push('price is required and must be a non-negative number');
}
}


if (req.method === 'POST' || category !== undefined) {
if (!category || typeof category !== 'string') {
errors.push('category is required and must be a string');
}
}


if (inStock !== undefined && typeof inStock !== 'boolean') {
// allow strings that coerce? reject non-boolean
errors.push('inStock must be a boolean');
}


if (errors.length) return next(new ValidationError(errors.join('; ')));
next();
};