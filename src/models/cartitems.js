import Sequelize, { Model } from "sequelize";

class CartItem extends Model {
  static init(sequelize) {
    super.init(
      {
        cartId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "carts",
            key: "id",
          },
        },
        productId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "products",
            key: "id",
          },
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        modelName: "CartItem",
        tableName: "cart_items",
        timestamps: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Cart, { foreignKey: "cartId", as: "cart" });
    this.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
  }
}

export default CartItem;
