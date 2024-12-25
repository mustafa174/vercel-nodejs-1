"use strict";

/** @type {import('sequelize-cli').Migration} */
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the `orders` table
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Ensure the "users" table exists
          key: "id",
        },
        onDelete: "CASCADE", // Optionally add cascading behavior
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending", // Default status
      },
      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      declineReason: {
        type: Sequelize.STRING,
        allowNull: true, // This will be nullable
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the `orders` table if rolling back the migration
    await queryInterface.dropTable("orders");
  },
};
