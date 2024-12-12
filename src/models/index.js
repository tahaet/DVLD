// const fs = require("fs");
// const path = require("path");
// const { Sequelize } = require("sequelize");
// const sequelize = require("../sequelize/sequelize"); // Adjust path to your Sequelize instance

// const models = {};

// // Dynamically read all model files in the directory
// fs.readdirSync(__dirname)
//   .filter((file) => file.endsWith(".js") && file !== "index.js") // Skip index.js
//   .forEach((file) => {
//     const model = require(`${path.join(__dirname, file)}`)(
//       sequelize,
//       Sequelize.DataTypes,
//     );
//     models[model.name] = model;
//   });

// // Set up associations if any are defined
// Object.keys(models).forEach((modelName) => {
//   if (models[modelName].associate) {
//     models[modelName].associate(models);
//   }
// });

// models.sequelize = sequelize;
// models.Sequelize = Sequelize;

// module.exports = models;
