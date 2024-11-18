// seeders/xxxxxx-demo-product.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("products", [
      {
        name: "Product A",
        price: 100,
        description: "This is product A",
        image: "image_url_A",
        status: "active",
        rating: 4.5,
        availability: "in stock",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Product B",
        price: 50,
        description: "This is product B",
        image: "image_url_B",
        status: "active",
        rating: 3.9,
        availability: "in stock",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("products", null, {});
  },
};
