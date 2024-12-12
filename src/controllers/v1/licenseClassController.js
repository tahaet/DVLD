const LicenseClass = require("../../models/licenseClass");
const handlerFactory = require("./handlerFactory");

exports.getOneLicenseClass = handlerFactory.getOneById(LicenseClass);
exports.getAllLicenseClasses = handlerFactory.getAll(LicenseClass);
exports.createLicenseClass = handlerFactory.createOne(LicenseClass);
exports.deleteLicenseClass = handlerFactory.deleteOne(LicenseClass);
exports.updateLicenseClass = handlerFactory.updateOne(LicenseClass);
