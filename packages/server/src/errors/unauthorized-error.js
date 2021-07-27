const { HttpError } = require("./http-error");

class UnauthorizedError extends HttpError {
  constructor(errorCode, message) {
    super(errorCode, message, 401);
  }
}

module.exports = { UnauthorizedError };
