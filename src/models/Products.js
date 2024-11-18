import Sequelize, { Model } from "sequelize";

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        price: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        image: {
          type: Sequelize.STRING, // URL of the image
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM("active", "inactive"),
          defaultValue: "active",
        },
        rating: {
          type: Sequelize.FLOAT,
          allowNull: true,
          validate: {
            min: 0,
            max: 5,
          },
        },
        availability: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: "Product",
        tableName: "products",
        timestamps: true,
      }
    );

    return this;
  }
}

export default Product;
