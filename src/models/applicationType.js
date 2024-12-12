const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize/sequelize");

class ApplicationType extends Model {}

ApplicationType.init(
  {
    application_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    application_type_title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    application_fees: {
      type: DataTypes.DECIMAL(10, 2), // Sequelize's DECIMAL type for smallmoney
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "application_types",
    modelName: "ApplicationType",
    timestamps: false,
  },
);

module.exports = ApplicationType;
