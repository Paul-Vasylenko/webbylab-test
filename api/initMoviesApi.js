const Router = require("express");
const db = require("../models");
const Op = require("sequelize").Op;
const fs = require("fs");
const authMiddleware = require("../middlewares/authMiddleware");
const ApiError = require("../helpers/ApiError");
module.exports = () => {
  const router = Router();

  router.get("/", authMiddleware, async (req, res, next) => {
    const {
      limit = 20,
      offset = 0,
      sort = "id",
      order = "ASC",
      actor,
      title,
      search,
    } = req.query;
    const defaultReturn = {
      limit,
      offset,
      order: [[sort, order]],
    };
    if (search) {
      const foundByTitle = await db.Movie.findAndCountAll({
        ...defaultReturn,
        include: [
          {
            model: db.Actor,
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
        ],
        where: {
          name: search,
        },
      });
      const foundByActors = await db.Movie.findAndCountAll({
        ...defaultReturn,
        include: [
          {
            model: db.Actor,
            through: { attributes: [] },
            attributes: ["id", "name"],
            where: {
              [Op.or]: [
                {
                  name: search,
                },
              ],
            },
          },
        ],
      });
      const resultFount = [...foundByTitle.rows, ...foundByActors.rows];
      res.send({
        data: resultFount,
        meta: {
          total: resultFount.length,
        },
      });
    }
    return db.Movie.findAndCountAll({
      ...defaultReturn,
      include: [
        {
          model: db.Actor,
          through: { attributes: [] },
          attributes: ["id", "name"],
          where: actor && { name: actor },
        },
      ],
      where: title && {
        name: title,
      },
    })
      .then((movies) => {
        return res.send({
          data: movies.rows,
          meta: {
            total: movies.rows.length,
          },
          status: 1,
        });
      })
      .catch((e) => {
        return next(e);
      });
  });

  router.get("/:id", authMiddleware, (req, res, next) => {
    const { id } = req.params;
    return db.Movie.findByPk(id, {
      include: [
        {
          model: db.Actor,
          through: { attributes: [] },
          attributes: ["id", "name"],
        },
      ],
    })
      .then((movie) => res.json({ data: movie, status: 1 }))
      .catch((e) => {
        return next(e);
      });
  });

  router.post("/", authMiddleware, async (req, res, next) => {
    try {
      const { title, year, format, actors } = req.body;
      if (!title || !year || !format || !actors) throw new Error();
      if (format !== "VHS" && format !== "DVD" && format !== "Blu-Ray")
        throw ApiError.badRequest("format can ve VHS, DVD or Blu-Ray");
      const actorsMapped = actors.map((item) => ({
        name: item,
      }));
      const movie = await db.Movie.create({
        name: title,
        year,
        format,
      });
      for (const actorObj of actorsMapped) {
        const [actor] = await db.Actor.findOrCreate({
          where: actorObj,
          defaults: actorObj,
        });
        await movie.addActor(actor);
      }

      return db.Movie.findByPk(movie.id, {
        include: [
          {
            model: db.Actor,
            through: { attributes: [] },
          },
        ],
      })
        .then((result) => res.json({ data: result, status: 1 }))
        .catch((e) => {
          return next(e);
        });
    } catch (e) {
      return next(e);
    }
  });

  router.delete("/:id", authMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const movie = await db.Movie.findByPk(id);
    if (!movie) {
      return next(ApiError.badRequest("Movie not found"));
    }
    movie.destroy().then((result) => {
      return res.json({ status: 1 });
    });
  });

  router.patch("/:id", authMiddleware, async (req, res, next) => {
    try {
      const { id } = req.params;

      const movie = await db.Movie.findByPk(id, {
        include: [
          {
            model: db.Actor,
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
        ],
      });
      if (!movie) {
        return next(ApiError.badRequest("Movie not found"));
      }
      const { title, year, format, actors } = req.body;
      if (format) if (title) movie.name = title;
      if (year) movie.year = year;

      if (format) {
        if (format !== "VHS" && format !== "DVD" && format !== "Blu-Ray")
          return next(ApiError.badRequest("format can ve VHS, DVD or Blu-Ray"));
        movie.format = format;
      }
      const actorsMapped = actors.map((item) => ({
        name: item,
      }));
      await movie.setActors([]);
      for (const actorObj of actorsMapped) {
        const [actor] = await db.Actor.findOrCreate({
          where: actorObj,
          defaults: actorObj,
        });
        await movie.addActor(actor);
      }
      //======
      //manually changed updated at
      //https://stackoverflow.com/questions/42519583/sequelize-updating-updatedat-manually
      //======
      movie.changed("updatedAt", true);
      movie.updatedAt = new Date();
      await movie.save();
      const updatedMovie = await db.Movie.findByPk(id, {
        include: [
          {
            model: db.Actor,
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
        ],
      });
      return res.json({ data: updatedMovie, status: 1 });
    } catch (e) {
      return next(e);
    }
  });

  router.post("/import", authMiddleware, async (req, res, next) => {
    const fileString = fs.readFileSync(req.files.movies.name, {
      encoding: "utf-8",
    });
    const fileLines = fileString
      .split("\n")
      .map((item) => item.replace("\r", ""))
      .filter((item) => item != "")
      .map((item) => item.trim());
    const numberOfMovies = fileLines.filter((line) =>
      line.includes("Title")
    ).length;
    const returnData = [];

    for (let counter = 0; counter < numberOfMovies; counter++) {
      const titleString = fileLines[4 * counter];
      const yearString = fileLines[4 * counter + 1];
      const formatString = fileLines[4 * counter + 2];
      const starsString = fileLines[4 * counter + 3];

      const title = titleString.split(": ")[1];
      const year = yearString.split(": ")[1];
      const format = formatString.split(": ")[1];
      const stars = starsString.split(": ")[1];
      const starsArray = stars.split(",").map((item) => item.trim());

      const actorsMapped = starsArray.map((item) => ({
        name: item,
      }));

      const movie = await db.Movie.create({
        name: title,
        year,
        format,
      });
      for (const actorObj of actorsMapped) {
        const [actor] = await db.Actor.findOrCreate({
          where: actorObj,
          defaults: actorObj,
        });
        await movie.addActor(actor);
      }
      returnData.push(movie);
    }
    return res.send({
      data: returnData,
      status: 1,
      meta: {
        imported: returnData.length,
        total: numberOfMovies,
      },
    });
  });
  return router;
};
