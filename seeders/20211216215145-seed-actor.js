"use strict";
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Actors",
      [
        {
          name: "John Doe",
        },
        {
          name: "Emma Watson",
        },
        {
          name: "Any Name",
        },
        {
          name: "Hello world",
        },
        {
          name: "Webby Lab",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Actors", null, {});
  },
};
