//const fs = require("fs");
//const path = require("path");
require("dotenv").config();
const logger = require("./util/logger");
const app = require("./app");
const sequelize = require("./sequelize/sequelize");
require("./models/testType");
require("./models/test");
require("./models/license");
require("./models/licenseClass");
require("./models/application");
require("./models/applicationType");
require("./models/detainedLicense");
require("./models/driver");
require("./models/localDrivingLicenseApplication");
require("./models/internationalLicense");
require("./models/testAppointment");
// const loadModels = (sequelizeInstance) => {
//   const models = {};
//   const modelsPath = path.join(__dirname, "models");

//   fs.readdirSync(modelsPath).forEach((file) => {
//     if (file.endsWith(".js")) {
//       const model = require(path.join(modelsPath, file))(sequelizeInstance);
//       models[model.name] = model;
//     }
//   });

//   // Set up associations (if any)
//   Object.keys(models).forEach((modelName) => {
//     if (models[modelName].associate) {
//       models[modelName].associate(models);
//     }
//   });

//   return models;
// };

// (async () => {
//   try {
//     // Authenticate the database connection
//     console.log(sequelize);
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");

//     // Load models
//     const models = loadModels(sequelize);

//     // Sync models to the database
//     await sequelize.sync({ alter: true }); // Use `alter: true` for incremental changes or `force: true` to drop and recreate tables.
//     console.log("All models were synchronized successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   } finally {
//     await sequelize.close();
//   }
// })();

sequelize
  .authenticate()
  .then(() => logger.info("Database connection established successfully!"))
  // .then(() => sequelize.sync({ force: true }))
  .catch((error) => logger.error("Unable to connect to the database:", error));

app.listen(3000, () => console.log("server running at http://localhost:3000"));
