const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize/sequelize"); // Assuming you have sequelize instance in config/database
const User = require("./user");
const TestAppointment = require("./testAppointment");

class Test extends Model {}
Test.init(
  {
    test_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    test_appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    test_result: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING(500),
      allowNull: true, // Nullable field
    },
    created_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Test",
    tableName: "tests",
    timestamps: false,
  },
);

Test.belongsTo(TestAppointment, { foreignKey: "test_appointment_id" });
TestAppointment.hasOne(Test, { foreignKey: "test_appointment_id", as: "test" });

Test.belongsTo(User, { foreignKey: "created_by_user_id" });
User.hasMany(Test, { foreignKey: "created_by_user_id", as: "tests" });

module.exports = Test;
