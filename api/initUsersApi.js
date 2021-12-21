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
      const { email, name, password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return res.json({
          errors: ["Password don't match"],
        });
      }
      const userData = await userService.registration(email, name, password);
      if (!userData)
        return next(ApiError.badRequest("Error in user crerating"));
      // userData has refreshToken, accessToken and information about created user
      return res.json({ token: userData.accessToken, status: 1 });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
