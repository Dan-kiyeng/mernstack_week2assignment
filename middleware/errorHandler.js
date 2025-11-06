const { AppError } = require('../errors/errors');


exports.errorHandler = (err, req, res, next) => {
const isOperational = err instanceof AppError;
const status = err.status || 500;
const payload = {
error: err.message || 'Internal Server Error'
};


if (process.env.NODE_ENV !== 'production') {
payload.stack = err.stack;
}


res.status(status).json(payload);
};