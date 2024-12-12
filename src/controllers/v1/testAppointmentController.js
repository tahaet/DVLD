const TestAppointment = require("../../models/testAppointment");
const catchHandler = require("../../util/catchHandler");
const handlerFactory = require("./handlerFactory");
const service = require("../../service/service");
const SD = require("../../util/SD");
const AppError = require("../../util/appError");
const Application = require("../../models/application");
const LocalDrivingLicenseApplication = require("../../models/localDrivingLicenseApplication");
const { DateTime } = require("mssql");
const ApplicationType = require("../../models/applicationType");

exports.getOneTestAppointment = handlerFactory.getOneById(TestAppointment);
exports.getAllTestAppointments = handlerFactory.getAll(TestAppointment);
exports.createTestAppointment = catchHandler(async (req, res, next) => {
  const testAppointment = await TestAppointment.create(req.body);
  await TestAppointment.update(
    { retake_test_application_id: req.body.retake_test_application_id },
    { where: { test_appointment_id: testAppointment.test_appointment_id } },
  );
  res.status(201).json({
    message: "success",
    data: {
      testAppointment,
    },
  });
});
exports.deleteTestAppointment = handlerFactory.deleteOne(TestAppointment);
exports.updateTestAppointment = handlerFactory.updateOne(TestAppointment);
exports.handleTestLogic = catchHandler(async (req, res, next) => {
  req.body.created_by_user_id = req.user.user_id;
  if (
    await service.isThereAnActiveScheduledTest(
      req.body.local_driving_license_application_id,
      req.body.test_type_id,
    )
  )
    return next(
      new AppError(
        "there is an active test appointment for this application",
        400,
      ),
    );
  if (
    !(await service.doesPassPreviousTestType(
      req.body.local_driving_license_application_id,
      req.body.test_type_id,
    ))
  )
    return next(
      new AppError(
        "this application didn't pass previous test,You have to apply for retake test application",
        400,
      ),
    );
  if (
    await service.doesPassTestType(
      req.body.local_driving_license_application_id,
      req.body.test_type_id,
    )
  )
    return next(new AppError("this application already passed this test", 400));
  if (
    await service.doesAttendTestType(
      req.body.local_driving_license_application_id,
      req.body.test_type_id,
    )
  ) {
    const localApplication = await LocalDrivingLicenseApplication.findByPk(
      req.body.local_driving_license_application_id,
      { raw: true, nest: true },
    );
    const application = await Application.create({
      applicant_person_id: localApplication.application.applicant_person_id,
      application_date: Date.now(),
      application_type_id: SD.ApplicationTypes.retake_test,
      application_status: SD.ApplicationStatus.COMPLETED,
      last_status_date: Date.now(),
      paid_fees: (
        await ApplicationType.findByPk(SD.ApplicationTypes.retake_test)
      ).application_fees,
      created_by_user_id: req.user.user_id,
    });
    req.body.retake_test_application_id = application.application_id;
  }
  next();
});
