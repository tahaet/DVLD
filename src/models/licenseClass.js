const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize/sequelize");

class LicenseClass extends Model {}

LicenseClass.init(
  {
    license_class_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    class_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    class_description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    minimum_allowed_age: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 18, // Default set for `MinimumAllowedAge`
    },
    default_validity_length: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1, // Default set for `DefaultValidityLength`
    },
    class_fees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0, // Default value for `ClassFees`
    },
  },
  {
    sequelize,
    modelName: "LicenseClass",
    tableName: "license_classes",
    timestamps: false,
  },
);

module.exports = LicenseClass;
