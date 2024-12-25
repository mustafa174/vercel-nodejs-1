import Sequelize, { Model } from "sequelize";

class OrderItem extends Model {
  static init(sequelize) {
    super.init(
      {
        orderId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "orders", // ensure this matches the exact table name
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        productId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "products", // ensure this matches the exact table name
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "OrderItem",
        tableName: "order_items", // Explicitly mention table name
        schema: "public", // If you're using a specific schema
        timestamps: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, { foreignKey: "orderId", as: "order" });
    this.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
  }
}

export default OrderItem;
