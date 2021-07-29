const { HttpError } = require("./http-error");

class BadRequestError extends HttpError {
  constructor(errorCode, message) {
    super(errorCode, message, 400);
  }
}

module.exports = { BadRequestError };
