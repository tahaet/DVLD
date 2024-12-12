const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize/sequelize");
const License = require("./license");
const User = require("./user");
const Application = require("./application");

class DetainedLicense extends Model {}
DetainedLicense.init(
  {
    detain_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    license_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    detain_date: {
      type: DataTypes.DATE, // Sequelize uses DATE for smalldatetime
      allowNull: false,
      defaultValue: Date.now(),
    },
    fine_fees: {
      type: DataTypes.DECIMAL(10, 2), // Sequelize's DECIMAL type for smallmoney
      allowNull: false,
    },
    created_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_released: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    release_date: {
      type: DataTypes.DATE, // Sequelize uses DATE for smalldatetime
      allowNull: true,
    },
    released_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    release_application_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "DetainedLicense",
    tableName: "detained_licenses",
    timestamps: false,
  },
);

DetainedLicense.belongsTo(License, {
  foreignKey: "license_id",
  as: "license",
});
License.hasMany(DetainedLicense, {
  foreignKey: "license_id",
  as: "detained_licenses",
});
DetainedLicense.belongsTo(User, {
  foreignKey: "created_by_user_id",
});
User.hasMany(DetainedLicense, {
  foreignKey: "created_by_user_id",
  as: "detained_licenses",
});
DetainedLicense.belongsTo(User, {
  foreignKey: "released_by_user_id",
  as: "released_by_user",
});
User.hasMany(DetainedLicense, {
  foreignKey: "released_by_user_id",
  as: "released_licenses",
});
DetainedLicense.belongsTo(Application, {
  foreignKey: "release_application_id",
});
Application.hasOne(DetainedLicense, {
  foreignKey: "release_application_id",
  as: "detained_license",
});

module.exports = DetainedLicense;
