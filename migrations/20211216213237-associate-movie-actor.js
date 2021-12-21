"use strict";
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Movie_Actor", {
      createdAt: {
        type: Sequelize.DATEONLY,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: Sequelize.DATEONLY,
        defaultValue: new Date(),
      },
      MovieId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      ActorId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Movie_Actor");
  },
};
