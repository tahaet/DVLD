const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize/sequelize");
const Person = require("./person");

class User extends Model {}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    password_changed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password_reset_token: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    password_reset_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    account_confirm_token: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    account_confirm_expires: {
      type: DataTypes.DATE(120),
      allowNull: true,
    },
    // person:{
    //   type:DataTypes.belongsTo:
    // }
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize, // Sequelize instance
    modelName: "User", // Model name
    tableName: "users", // Table name in the database
    timestamps: false,
  },
);

User.belongsTo(Person, {
  foreignKey: "person_id",
  as: "person",
});
Person.hasOne(User, {
  foreignKey: "person_id",
  as: "user",
});

User.addHook("beforeFind", (options) => {
  if (!options.include) {
    options.include = [];
  }
  options.attributes = [
    "user_name",
    "is_active",
    "is_confirmed",
    "user_id",
    "role",
    "password",
  ];
  options.include.push({
    model: Person,
    as: "person",
    required: false,
  });
});

module.exports = User;
