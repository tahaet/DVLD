const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize/sequelize");

class Country extends Model {}

Country.init(
  {
    country_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    country_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Country",
    tableName: "countries",
    timestamps: false,
  },
);

module.exports = Country;
