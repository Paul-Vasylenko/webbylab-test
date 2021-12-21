const Router = require("express");
const body = require("express-validator").body;
const validationResult = require("express-validator").validationResult;
const userService = require("../services/UserService");
const ApiError = require("../helpers/ApiError");

module.exports = () => {
  const router = Router();

  router.post("/", body("email").isEmail(), async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest("Validation error", errors.array()));
      }
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      if (!userData) return next(ApiError.badRequest("Error in user login"));
      return res.json({ token: userData.accessToken, status: 1 });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
