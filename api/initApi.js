const Router = require("express");
const initMoviesApi = require("./initMoviesApi");
const initSessionsApi = require("./initSessionsApi");
const initUsersApi = require("./initUsersApi");

module.exports = () => {
  const router = Router();

  router.use("/users", initUsersApi());

  router.use("/sessions", initSessionsApi());

  router.use("/movies", initMoviesApi());

  return router;
};
