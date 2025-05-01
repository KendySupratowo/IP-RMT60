"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class XiaomiDevice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      XiaomiDevice.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: "XiaomiDeviceId",
      });
    }
  }
  XiaomiDevice.init(
    {
      key: DataTypes.STRING,
      device_name: DataTypes.STRING,
      device_image: DataTypes.STRING,
      display_size: DataTypes.STRING,
      display_res: DataTypes.STRING,
      camera: DataTypes.STRING,
      video: DataTypes.STRING,
      ram: DataTypes.STRING,
      chipset: DataTypes.STRING,
      battery: DataTypes.STRING,
      batteryType: DataTypes.STRING,
      body: DataTypes.STRING,
      os_type: DataTypes.STRING,
      storage: DataTypes.STRING,
      comment: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "XiaomiDevice",
    }
  );
  return XiaomiDevice;
};
