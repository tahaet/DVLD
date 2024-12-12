const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize/sequelize");

class LocalDrivingLicenseApplicationsView extends Model {}
LocalDrivingLicenseApplicationsView.init(
  {
    local_driving_license_application_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    class_name: {
      type: DataTypes.STRING,
    },
    national_no: {
      type: DataTypes.STRING,
    },
    full_name: {
      type: DataTypes.STRING,
    },
    application_date: {
      type: DataTypes.DATE,
    },
    passed_test_count: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "local_driving_license_applications_View", // Name of the view
    timestamps: false,
    freezeTableName: true,
  },
);

module.exports = LocalDrivingLicenseApplicationsView;
