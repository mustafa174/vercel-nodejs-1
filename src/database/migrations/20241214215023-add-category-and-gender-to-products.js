"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("products", "category", {
      type: Sequelize.STRING,
      allowNull: true, // Set `allowNull` to true if optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("products", "category");
    await queryInterface.removeColumn("products", "for");
  },
};
