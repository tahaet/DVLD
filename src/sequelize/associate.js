// const User = require("../models/user");
// const Person = require("../models/person");
// const Country = require("../models/country");
// const Application = require("../models/application");
// const ApplicationType = require("../models/applicationType");
// const LicenseClass = require("../models/licenseClass");
// const License = require("../models/license");
// const TestType = require("../models/testType");
// const Test = require("../models/test");
// const InternationalLicense = require("../models/internationalLicense");
// const LocalDrivingLicenseApplication = require("../models/localDrivingLicenseApplication");
// const Driver = require("../models/driver");
// const DetainedLicense = require("../models/detainedLicense");
// const TestAppointment = require("../models/testAppointment");
// const sequelize = require("./sequelize");

// const models = {
//   Country,
//   User,
//   Person,
//   ApplicationType,
//   Application,
//   LicenseClass,
//   License,
//   TestType,
//   Test,
//   LocalDrivingLicenseApplication,
//   InternationalLicense,
//   Driver,
//   TestAppointment,
//   DetainedLicense,
// };
// Object.values(models).forEach((model) => {
//   model.init(model.rawAttributes, {
//     sequelize,
//     modelName: model.name,
//     tableName: model.tableName,
//   });
// });

// Object.values(models).forEach((model) => {
//   if (model.associate) {
//     model.associate(models);
//   }
// });

// module.exports = models;
