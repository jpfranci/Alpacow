class HttpError extends Error {
  constructor(errorCode, message, status) {
    super(message);
    this.errorCode = errorCode;
    this.status = status;
  }
}

module.exports = { HttpError };
