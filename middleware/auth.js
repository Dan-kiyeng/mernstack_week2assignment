const { UnauthorizedError } = require('../errors/errors');


module.exports = (req, res, next) => {
const apiKey = req.header('x-api-key');
if (!apiKey || apiKey !== process.env.API_KEY) {
return next(new UnauthorizedError('Invalid or missing API key'));
}
next();
};