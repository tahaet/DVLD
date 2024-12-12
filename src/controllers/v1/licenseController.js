const handlerFactory = require("./handlerFactory");
const License = require("../../models/license");
const AppError = require("../../util/appError");
const service = require("../../service/service");
const catchHandler = require("../../util/catchHandler");
const Driver = require("../../models/driver");
const LocalDrivingLicenseApplication = require("../../models/localDrivingLicenseApplication");
const SD = require("../../util/SD");
const DetainedLicense = require("../../models/detainedLicense");
const Application = require("../../models/application");
const ApplicationType = require("../../models/applicationType");
const LicenseClass = require("../../models/licenseClass");

exports.getAllLicenses = handlerFactory.getAll(License);
exports.getLicenseById = handlerFactory.getOneById(License);
// exports.createLicense = handlerFactory.createOne(License);
exports.updateLicense = handlerFactory.updateOne(License);
exports.deleteLicense = handlerFactory.deleteOne(License);
exports.getByQuery = handlerFactory.getOneBy(License);
exports.createLicense = catchHandler(async (req, res, next) => {
  if (!(await service.doesPassAllTests(req.params.local_application_id)))
    return next(
      new AppError("This person didn't pass the required tests", 400),
    );
  const localApplication = await LocalDrivingLicenseApplication.findByPk(
    req.params.local_application_id,
  );
  if (!localApplication)
    return next(new AppError("there is no application with that id", 404));
  let driver = await Driver.findOne({
    where: { driver_id: localApplication.application.applicant_person_id },
  });
  if (!driver)
    driver = await Driver.create({
      person_id: localApplication.application.applicant_person_id,
      created_by_user_id: req.user.user_id,
      created_date: Date.now(),
    });
  if (
    await License.findOne(
      {
        Where: {
          driver_id: driver.driver_id,
          is_active: true,
          issue_reason: SD.IssueReason.FirstTime,
          license_class_id: localApplication.license_class_id,
        },
      },
      {
        attributes: ["license_id"],
      },
    )
  ) {
    return next(
      new AppError(
        "There is an active license of the same license class for this person ",
        400,
      ),
    );
  }
  const license = await License.create({
    application_id: localApplication.application.application_id,
    driver_id: driver.driver_id,
    license_class_id: localApplication.license_class_id,
    issue_date: Date.now(),
    expiration_date: new Date().setFullYear(
      new Date(Date.now()).getFullYear() +
        localApplication.license_class.default_validity_length,
    ),
    notes: req.body.notes,
    paid_fees: localApplication.license_class.class_fees,
    is_active: true,
    issue_reason: SD.IssueReason.FirstTime,
    created_by_user_id: req.user.user_id,
  });
  localApplication.application.application_status = 3;
  await localApplication.application.save();

  res.status(201).json({
    message: "success",
    data: {
      license,
    },
  });
});
// exports.createLicense = catchHandler(async (req, res, next) => {
//   const license = await License.create(req.body);
//   await Driver.create({});
// });
exports.getAllDetainedLicenses = handlerFactory.getAll(DetainedLicense);
exports.detainLogic = catchHandler(async (req, res, next) => {
  if (
    await DetainedLicense.findOne({
      where: { license_id: req.body.license_id, is_released: false },
    })
  )
    return next(new AppError("this license is already detained", 400));
  next();
});
exports.detainLicense = handlerFactory.createOne(DetainedLicense);

exports.handleReleaseLogic = catchHandler(async (req, res, next) => {
  const license = await License.findByPk(req.body.license_id, {
    raw: true,
    nest: true,
  });
  if (!license)
    return next(new AppError("there is no existing license with that id", 404));

  const detain = await DetainedLicense.findOne({
    where: { license_id: req.body.license_id, is_released: false },
  });
  if (!detain) return next(new AppError("This license is not detained", 400));
  const application = await Application.create({
    applicant_person_id: license.driver.person.person_id,
    application_type_id: SD.ApplicationTypes.release_detained_driving_license,
    application_status: SD.ApplicationStatus.COMPLETED,
    application_date: Date.now(),
    last_status_date: Date.now(),
    paid_fees: (
      await ApplicationType.findByPk(
        SD.ApplicationTypes.release_detained_driving_license,
        { attributes: ["application_fees"], raw: true },
      )
    ).application_fees,
    created_by_user_id: req.body.created_by_user_id,
  });
  req.body.application_id = application.application_id;
  req.body.is_released = true;
  req.body.release_date = Date.now();
  req.body.released_by_user_id = req.user.user_id;
  req.body.release_application_id = application.application_id;
  //req.params.id = detain.detain_id;
  next();
});
exports.releaseDetainedLicense = handlerFactory.updateOne(DetainedLicense);
exports.renewLicense = catchHandler(async (req, res, next) => {
  const license = await License.findByPk(req.body.license_id, {
    raw: true,
    nest: true,
  });
  if (!license)
    return next(new AppError("there is no license with that id", 404));

  if (license.expiration_date > Date.now())
    return next(new AppError("this license didn't expired yet", 400));
  const application = await Application.create({
    applicant_person_id: license.driver.person.person_id,
    application_type_id: SD.ApplicationTypes.renew_driving_license_service,
    application_status: SD.ApplicationStatus.COMPLETED,
    application_date: Date.now(),
    last_status_date: Date.now(),
    paid_fees: (
      await ApplicationType.findByPk(
        SD.ApplicationTypes.renew_driving_license_service,
        { attributes: ["application_fees"], raw: true },
      )
    ).application_fees,
    created_by_user_id: req.body.created_by_user_id,
  });
  const licenseClass = await LicenseClass.findByPk(license.license_class_id, {
    raw: true,
  });
  const newLicense = await License.create({
    driver_id: license.driver_id,
    issue_date: Date.now(),
    issue_reason: SD.IssueReason.Renew,
    created_by_user_id: req.user.user_id,
    expiration_date: new Date().setFullYear(
      new Date(Date.now()).getFullYear() + licenseClass.default_validity_length,
    ),
    license_class_id: licenseClass.license_class_id,
    paid_fees: licenseClass.class_fees,
    application_id: application.application_id,
    notes: req.body.notes || null,
  });
  await License.update(
    { is_active: false },
    { where: { license_id: req.body.license_id } },
  );
  res.status(201).json({
    message: "success",
    data: {
      license: newLicense,
    },
  });
});
exports.replaceForDamagedOrLost = catchHandler(async (req, res, next) => {
  const license = await License.findOne(
    { where: { license_id: req.body.license_id, is_active: true } },
    {
      raw: true,
      nest: true,
    },
  );
  if (!license)
    return next(new AppError("there is no license with that id", 404));

  if (
    DetainedLicense.findOne({
      where: { license_id: license.license_id, is_released: false },
      raw: true,
    })
  )
    return next(new AppError("this license is detained", 400));
  const application = await Application.create({
    applicant_person_id: license.driver.person.person_id,
    application_type_id:
      req.body.issue_reason ===
      SD.ApplicationTypes.replacement_for_damaged_driving_license
        ? SD.ApplicationTypes.replacement_for_damaged_driving_license
        : SD.ApplicationTypes.replacement_for_lost_driving_license,
    application_status: SD.ApplicationStatus.COMPLETED,
    application_date: Date.now(),
    last_status_date: Date.now(),
    paid_fees: (
      await ApplicationType.findByPk(
        req.body.issue_reason ===
          SD.ApplicationTypes.replacement_for_damaged_driving_license
          ? SD.ApplicationTypes.replacement_for_damaged_driving_license
          : SD.ApplicationTypes.replacement_for_lost_driving_license,
        { attributes: ["application_fees"], raw: true },
      )
    ).application_fees,
    created_by_user_id: req.body.created_by_user_id,
  });
  const licenseClass = await LicenseClass.findByPk(license.license_class_id, {
    raw: true,
  });
  const newLicense = await License.create({
    driver_id: license.driver_id,
    issue_date: Date.now(),
    issue_reason:
      req.body.issue_reason ===
      SD.ApplicationTypes.replacement_for_damaged_driving_license
        ? SD.ApplicationTypes.replacement_for_damaged_driving_license
        : SD.ApplicationTypes.replacement_for_lost_driving_license,
    created_by_user_id: req.user.user_id,
    expiration_date: new Date().setFullYear(
      new Date(Date.now()).getFullYear() + licenseClass.default_validity_length,
    ),
    license_class_id: licenseClass.license_class_id,
    paid_fees: licenseClass.class_fees,
    application_id: application.application_id,
    notes: req.body.notes || null,
  });
  await License.update(
    { is_active: false },
    { where: { license_id: req.body.license_id } },
  );
  res.status(201).json({
    message: "success",
    data: {
      license: newLicense,
    },
  });
});
