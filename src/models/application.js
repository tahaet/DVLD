const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize/sequelize");
const User = require("./user");
const ApplicationType = require("./applicationType");
const Person = require("./person");

class Application extends Model {}
Application.init(
  {
    application_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    applicant_person_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    application_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    application_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    application_status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
    },
    last_status_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paid_fees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    created_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "applications",
    modelName: "Application",
    timestamps: false,
  },
);

Application.belongsTo(Person, {
  foreignKey: "applicant_person_id",
  as: "person",
});

Application.belongsTo(ApplicationType, {
  foreignKey: "application_type_id",
  as: "application_type",
});

Application.belongsTo(User, {
  foreignKey: "created_by_user_id",
  as: "created_by_user",
});

Application.addHook("beforeFind", (options) => {
  if (!options.include) {
    options.include = [];
  }
  options.include.push(
    {
      model: Person,
      as: "person",
      required: false,
    },
    {
      model: User,
      as: "created_by_user",
      required: false,
    },
    {
      model: ApplicationType,
      as: "application_type",
      required: false,
    },
  );
});
module.exports = Application;
