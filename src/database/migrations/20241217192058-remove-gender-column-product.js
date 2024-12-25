"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // await queryInterface.addColumn("products", "category", {
    //   type: Sequelize.STRING,
    //   allowNull: true, // Set `allowNull` to true if optional
    // });
    await queryInterface.addColumn("products", "target_audience", {
      type: Sequelize.STRING,
      allowNull: true, // Set `allowNull` to true if optional
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("products", "gender");
  },
};
