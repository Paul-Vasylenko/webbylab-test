"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Movie_Actor",
      [
        {
          MovieId: 1,
          ActorId: 1,
        },
        {
          MovieId: 1,
          ActorId: 2,
        },
        {
          MovieId: 1,
          ActorId: 3,
        },
        {
          MovieId: 2,
          ActorId: 1,
        },
        {
          MovieId: 2,
          ActorId: 3,
        },
        {
          MovieId: 2,
          ActorId: 4,
        },
        {
          MovieId: 3,
          ActorId: 1,
        },
        {
          MovieId: 3,
          ActorId: 4,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {},
};
