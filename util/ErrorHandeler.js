class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(); // (1)
    this.message = message || "Something went wrong";
    this.statusCode = statusCode;

    // Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorHandler;
