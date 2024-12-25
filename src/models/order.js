import Sequelize, { Model } from "sequelize";

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users", // Ensure the "users" table exists
            key: "id",
          },
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "pending", // Example statuses: "pending", "confirmed", etc.
        },
        totalPrice: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        declineReason: {
          type: Sequelize.STRING,
          allowNull: true, // Only applicable if the status is "declined"
        },
      },
      {
        sequelize,
        modelName: "Order",
        tableName: "orders",
        timestamps: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    this.hasMany(models.OrderItem, { foreignKey: "orderId", as: "orderItems" });
  }
}

export default Order;
