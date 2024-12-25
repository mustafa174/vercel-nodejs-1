import Sequelize, { Model } from "sequelize";

class Cart extends Model {
  static init(sequelize) {
    super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users", // Reference the users table
            key: "id",
          },
        },
      },
      {
        sequelize,
        modelName: "Cart",
        tableName: "carts",
        timestamps: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    this.hasMany(models.CartItem, { foreignKey: "cartId", as: "cartItems" });
  }
}

export default Cart;
