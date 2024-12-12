const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize/sequelize");
const Person = require("./person");
const User = require("./user");

class Driver extends Model {}
Driver.init(
  {
    driver_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Driver",
    tableName: "drivers",
    timestamps: false,
  },
);

Driver.belongsTo(Person, { foreignKey: "person_id", as: "person" });
Person.hasOne(Driver, { foreignKey: "person_id", as: "driver" });
Driver.belongsTo(User, {
  foreignKey: "created_by_user_id",
  as: "created_by_user",
});
User.hasMany(Driver, { foreignKey: "created_by_user_id", as: "driver" });

Driver.addHook("beforeFind", (options) => {
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
  );
});

module.exports = Driver;
