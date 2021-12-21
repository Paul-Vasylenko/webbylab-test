"use strict";
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Movies",
      [
        {
          name: "Harry Potter",
          year: 2017,
          format: "VHS",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Harry Potter 2",
          year: 2018,
          format: "VHS",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Harry Potter 3",
          year: 2019,
          format: "VHS",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Harry Potter 4",
          year: 2020,
          format: "VHS",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Movies", null, {});
  },
};
