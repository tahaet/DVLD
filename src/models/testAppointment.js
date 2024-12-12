const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize/sequelize");
const TestType = require("./testType");
const User = require("./user");
const Application = require("./application");
const LocalDrivingLicenseApplication = require("./localDrivingLicenseApplication");

class TestAppointment extends Model {}
TestAppointment.init(
  {
    test_appointment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    test_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    local_driving_license_application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    appointment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paid_fees: {
      type: DataTypes.SMALLINT, // Adjust based on the precision you need (use DECIMAL for monetary values if needed)
      allowNull: false,
    },
    created_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default to 0 (false)
      allowNull: false,
    },
    retake_test_application_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable field
    },
  },
  {
    sequelize,
    modelName: "TestAppointment",
    tableName: "test_appointments",
    timestamps: false,
  },
);

TestAppointment.belongsTo(TestType, { foreignKey: "test_type_id" });
TestType.hasMany(TestAppointment, {
  foreignKey: "test_type_id",
  as: "test_appointments",
});

TestAppointment.belongsTo(LocalDrivingLicenseApplication, {
  foreignKey: "local_driving_license_application_id",
  as: "local_driving_license_application",
});
LocalDrivingLicenseApplication.hasMany(TestAppointment, {
  foreignKey: "local_driving_license_application_id",
  as: "test_appointments",
});

TestAppointment.belongsTo(User, {
  foreignKey: "created_by_user_id",
  as: "created_by_user",
});
User.hasMany(TestAppointment, {
  foreignKey: "created_by_user_id",
  as: "test_appointments",
});

TestAppointment.belongsTo(Application, {
  foreignKey: "retake_test_application_id",
  as: "retakeTestApplication",
});
Application.hasMany(TestAppointment, {
  foreignKey: "retake_test_application_id",
  as: "test_appointments",
});

module.exports = TestAppointment;
