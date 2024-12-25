"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {},

  down: async (queryInterface, Sequelize) => {
    // Revert the migration by removing the 'role' column
  },
};
