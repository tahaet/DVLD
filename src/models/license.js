const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize/sequelize");
const Application = require("./application");
const User = require("./user");
const LicenseClass = require("./licenseClass");
const Driver = require("./driver");
const Person = require("./person");

class License extends Model {}
License.init(
  {
    license_id: {
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
    license_class_id: {
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
    notes: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    paid_fees: {
      type: DataTypes.DECIMAL(10, 2), // Sequelize's DECIMAL type for smallmoney
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    issue_reason: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    created_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "License",
    tableName: "licenses",
    timestamps: false,
  },
);

License.belongsTo(Application, {
  foreignKey: "application_id",
  as: "application",
});
Application.hasOne(License, {
  foreignKey: "application_id",
  as: "license",
});

License.belongsTo(Driver, { foreignKey: "driver_id", as: "driver" });
Driver.hasMany(License, { foreignKey: "driver_id", as: "licenses" });

License.belongsTo(LicenseClass, {
  foreignKey: "license_class_id",
  as: "license_class",
});
LicenseClass.hasMany(License, {
  foreignKey: "license_class_id",
  as: "licenses",
});

License.belongsTo(User, {
  foreignKey: "created_by_user_id",
  as: "created_by_user",
});
User.hasMany(License, {
  foreignKey: "created_by_user_id",
  as: "licenses",
});
License.addHook("beforeFind", (options) => {
  if (!options.include) {
    options.include = [];
  }
  options.include.push(
    {
      model: User,
      as: "created_by_user",
      required: false,
    },
    {
      model: Driver,
      as: "driver",
      required: false,
      include: {
        model: Person,
        as: "person",
        required: false,
        attributes: ["person_id"],
      },
    },
  );
});

module.exports = License;
