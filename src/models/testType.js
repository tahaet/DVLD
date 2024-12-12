const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize/sequelize"); // Assuming you have sequelize instance in config/database

class TestType extends Model {}
TestType.init(
  {
    test_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    test_type_title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    test_type_description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    test_type_fees: {
      type: DataTypes.SMALLINT, // Adjust to appropriate Sequelize data type (sequalize does not have smallmoney, but smallint can be used)
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TestType", // Model name
    tableName: "test_types",
    timestamps: false,
  },
);
module.exports = TestType;
