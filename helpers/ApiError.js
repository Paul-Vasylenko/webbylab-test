class ApiError extends Error {
  status;
  message;
  errors;
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }

  static badRequest(message, errors = []) {
    return new ApiError(404, message, errors);
  }

  static forbidden(message, errors = []) {
    return new ApiError(403, message, errors);
  }

  static internal(message, errors = []) {
    return new ApiError(500, message, errors);
  }

  static Unathorized() {
    return new ApiError(401, "User is not authorized");
  }
}

module.exports = ApiError;
