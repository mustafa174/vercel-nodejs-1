"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the avatar column to the Users table
    await queryInterface.addColumn("Users", "avatar", {
      type: Sequelize.STRING, // Store the URL of the avatar (string)
      allowNull: true, // Avatar is optional for users
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the avatar column in case of a rollback
    await queryInterface.removeColumn("Users", "avatar");
  },
};
