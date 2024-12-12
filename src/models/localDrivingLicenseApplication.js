const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize/sequelize"); // Assuming you have sequelize instance in sequelize/sequelize
const Application = require("./application");
const User = require("./user");
const LicenseClass = require("./licenseClass");
const ApplicationType = require("./applicationType");

class LocalDrivingLicenseApplication extends Model {}
LocalDrivingLicenseApplication.init(
  {
    local_driving_license_application_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    license_class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "local_driving_license_applications",
    modelName: "LocalDrivingLicenseApplication", // Model name
    timestamps: false,
  },
);

LocalDrivingLicenseApplication.belongsTo(Application, {
  foreignKey: "application_id",
  as: "application",
});
Application.hasOne(LocalDrivingLicenseApplication, {
  foreignKey: "application_id",
  as: "local_driving_license_application",
});

LocalDrivingLicenseApplication.belongsTo(LicenseClass, {
  foreignKey: "license_class_id",
  as: "license_class",
});
LicenseClass.hasMany(LocalDrivingLicenseApplication, {
  foreignKey: "license_class_id",
  as: "local_driving_license_applications",
});

LocalDrivingLicenseApplication.addHook("beforeFind", (options) => {
  if (!options.include) {
    options.include = [];
  }
  options.include.push(
    {
      model: LicenseClass,
      as: "license_class",
      attributes: ["class_fees", "default_validity_length"],
    },
    {
      model: Application,
      as: "application",
      required: false,
      include: [
        {
          model: User, // Include User through Application
          as: "created_by_user",
          required: false,
        },
        {
          model: ApplicationType,
          as: "application_type",
          attributes: ["application_fees"],
        },
      ],
    },
  );
});
module.exports = LocalDrivingLicenseApplication;
