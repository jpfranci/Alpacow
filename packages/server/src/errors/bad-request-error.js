class BadRequestError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.errorCode = errorCode;
    this.status = 400;
  }
}

module.exports = { BadRequestError };
