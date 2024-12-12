const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize/sequelize"); // Adjust to your sequelize instance
const Country = require("./country");

class Person extends Model {}

Person.init(
  {
    person_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    national_no: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    second_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    third_name: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    gendor: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    nationality_country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "countries",
        key: "country_id",
      },
    },
    image_path: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Person",
    tableName: "people",
    timestamps: false,
    freezeTableName: true,
  },
);

Person.belongsTo(Country, { foreignKey: "nationality_country_id" });
Country.hasMany(Person, {
  foreignKey: "nationality_country_id",
});
module.exports = Person;
