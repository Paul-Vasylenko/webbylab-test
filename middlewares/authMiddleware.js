const tokenService = require("../services/TokenService");
const ApiError = require("../helpers/ApiError");

function authMiddleware(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      next(ApiError.Unathorized());
    }
    const accessToken = authorizationHeader?.split(" ")[1];
    if (!accessToken) {
      next(ApiError.Unathorized());
    }
    const userData = tokenService.verifyAccessToken(accessToken ?? "");
    if (!userData) {
      next(ApiError.Unathorized());
    }

    req.user = userData;
    next();
  } catch (e) {
    throw next(ApiError.Unathorized());
  }
}

module.exports = authMiddleware;
