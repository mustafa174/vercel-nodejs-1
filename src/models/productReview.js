import Sequelize, { Model } from "sequelize";

class ProductReview extends Model {
  static init(sequelize) {
    super.init(
      {
        rating: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            min: 1, // Rating minimum value
            max: 5, // Rating maximum value
          },
        },
        comment: {
          type: Sequelize.TEXT,
          allowNull: true, // Comment is optional
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users", // Reference the users table
            key: "id",
          },
          onDelete: "CASCADE", // Ensure reviews are deleted when the user is deleted
        },
        productId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "products", // Reference the products table
            key: "id",
          },
          onDelete: "CASCADE", // Ensure reviews are deleted when the product is deleted
        },
      },
      {
        sequelize,
        modelName: "ProductReview",
        tableName: "product_reviews",
        timestamps: true,
      }
    );

    return this;
  }

  static associate(models) {
    // Define associations here
    this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    this.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
  }
}

export default ProductReview;
