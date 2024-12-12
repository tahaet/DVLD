const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize/sequelize"); // Assuming you have sequelize instance in config/database
const Application = require("./application");
const License = require("./license");
const Driver = require("./driver");
const User = require("./user");

class InternationalLicense extends Model {}
InternationalLicense.init(
  {
    international_license_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    issued_using_local_license_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    issue_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "InternationalLicense",
    tableName: "international_licenses",
    timestamps: false,
  },
);

InternationalLicense.belongsTo(Application, {
  foreignKey: "application_id",
  as: "application",
});
Application.hasOne(InternationalLicense, {
  foreignKey: "application_id",
  as: "international_license",
});

InternationalLicense.belongsTo(Driver, { foreignKey: "driver_id" });
Driver.hasMany(InternationalLicense, {
  foreignKey: "driver_id",
  as: "international_licenses",
});

InternationalLicense.belongsTo(License, {
  foreignKey: "issued_using_local_license_id",
});
License.hasOne(InternationalLicense, {
  foreignKey: "issued_using_local_license_id",
  as: "license",
});

InternationalLicense.belongsTo(User, {
  foreignKey: "created_by_user_id",
});
User.hasMany(InternationalLicense, {
  foreignKey: "created_by_user_id",
  ref: "created_by_user",
});

InternationalLicense.addHook("beforeFind", (options) => {
  if (!options.include) {
    options.include = [];
  }
  options.include.push(
    {
      model: Driver,
      as: "driver",
      required: false,
    },
    {
      model: User,
      as: "created_by_user",
      required: false,
    },
  );
});

module.exports = InternationalLicense;
