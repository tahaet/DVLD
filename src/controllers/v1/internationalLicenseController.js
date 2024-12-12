const handlerFactory = require("./handlerFactory");
const InternationalLicense = require("../../models/internationalLicense");
const AppError = require("../../util/appError");
const catchHandler = require("../../util/catchHandler");
const Driver = require("../../models/driver");
const Application = require("../../models/application");
const SD = require("../../util/SD");

exports.getAllInternationalLicenses =
  handlerFactory.getAll(InternationalLicense);
exports.getInternationalLicenseById =
  handlerFactory.getOneById(InternationalLicense);
exports.handInternationalLicenseLogic = catchHandler(async (req, res, next) => {
  const driver = await Driver.findByPk(req.body.driver_id);
  if (!driver) return next(new AppError("This person isn't a driver", 400));

  const application = Application.create({
    applicant_person_id: license.driver.person.person_id,
    application_type_id:
      SD.ApplicationTypes.new_international_driving_license_service,
    application_status: SD.ApplicationStatus.COMPLETED,
    application_date: Date.now(),
    last_status_date: Date.now(),
    paid_fees: (
      await ApplicationType.findByPk(
        SD.ApplicationTypes.new_international_driving_license_service,
        { attributes: ["application_fees"], raw: true },
      )
    ).application_fees,
    created_by_user_id: req.body.created_by_user_id,
  });
  req.body.application_id = application.application_id;
  req.body.driver_id = driver.driver_id;
  next();
});
exports.createInternationalLicense =
  handlerFactory.createOne(InternationalLicense);
exports.updateInternationalLicense =
  handlerFactory.updateOne(InternationalLicense);
exports.deleteInternationalLicense =
  handlerFactory.deleteOne(InternationalLicense);
exports.getByQuery = handlerFactory.getOneBy(InternationalLicense);
