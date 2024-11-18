import Sequelize, { Model } from "sequelize";

class Address extends Model {
  static init(sequelize) {
    super.init(
      {
        city: Sequelize.STRING,
        country: Sequelize.STRING,
        postal_code: Sequelize.NUMBER,
        address: Sequelize.STRING,
      },
      {
        sequelize,
        timestamps: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.User, {
      through: "UserAddress",
      foreignKey: "addressId",
    });
  }
}

export default Address;
