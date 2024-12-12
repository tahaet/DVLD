const handlerFactory = require("./handlerFactory");
const LocalDrivingLicenseApplication = require("../../models/localDrivingLicenseApplication");
const LocalDrivingLicenseApplicationView = require("../../models/localDrivingLicenseApplicationView");
const services = require("../../service/service");
const catchHandler = require("../../util/catchHandler");
exports.getAllLocalDrivingLicenseApplications = handlerFactory.getAll(
  LocalDrivingLicenseApplication,
);

exports.getLocalDrivingLicenseApplicationBy = handlerFactory.getOneBy(
  LocalDrivingLicenseApplication,
);
exports.createLocalDrivingLicenseApplication = handlerFactory.createOne(
  LocalDrivingLicenseApplication,
);
exports.updateLocalDrivingLicenseApplication = handlerFactory.updateOne(
  LocalDrivingLicenseApplication,
);
exports.deleteLocalDrivingLicenseApplication = handlerFactory.deleteOne(
  LocalDrivingLicenseApplication,
);
exports.getActiveLocalDrivingLicenseApplicationId = handlerFactory.getOneBy(
  LocalDrivingLicenseApplication,
  {
    attributes: ["local_driving_license_application_id"],
  },
);
// exports.doesHaveActiveApplication=catchHandler(async(req,res,next)=>{
//   const result = await services.
// })
