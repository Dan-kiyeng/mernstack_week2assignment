class AppError extends Error {
constructor(message, status = 500) {
super(message);
this.status = status;
this.name = this.constructor.name;
Error.captureStackTrace(this, this.constructor);
}
}


class NotFoundError extends AppError {
constructor(message = 'Not Found') {
super(message, 404);
}
}


class ValidationError extends AppError {
constructor(message = 'Validation Error') {
super(message, 400);
}
}


class UnauthorizedError extends AppError {
constructor(message = 'Unauthorized') {
super(message, 401);
}
}


module.exports = {
AppError,
NotFoundError,
ValidationError,
UnauthorizedError
};