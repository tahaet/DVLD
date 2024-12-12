const Test = require("../../models/test");
const catchHandler = require("../../util/catchHandler");
const handlerFactory = require("./handlerFactory");
const service = require("../../service/service");
const SD = require("../../util/SD");
const TestAppointment = require("../../models/testAppointment");
const AppError = require("../../util/appError");
exports.getOneTest = handlerFactory.getOneById(Test);
exports.getAllTests = handlerFactory.getAll(Test);
exports.createTest = catchHandler(async (req, res, next) => {
  const test = await Test.create(req.body, { validate: true });
  await TestAppointment.update(
    {
      is_locked: true, // Fields to update
    },
    {
      where: {
        test_appointment_id: test.test_appointment_id,
      },
    },
  );

  res.status(200).json({
    status: "success",
    data: {
      test: test,
    },
  });
});
exports.deleteTest = handlerFactory.deleteOne(Test);
exports.updateTest = handlerFactory.updateOne(Test);
// exports.setQueryString = (req,res,next)=>{
//     req.query.
// }
exports.handleTestLogic = catchHandler(async (req, res, next) => {
  req.body.created_by_user_id = req.user.user_id;
  req.body.test_appointment_id = req.params.appointment_id;
  req.body.local_driving_license_application_id = req.params.application_id;
  const testAppointment = await TestAppointment.findByPk(
    req.body.test_appointment_id,
    { raw: true },
  );

  if (
    (await service.doesAttendTestType(
      req.body.local_driving_license_application_id,
      testAppointment.test_type_id,
    )) &&
    !testAppointment.retake_test_application_id
  ) {
    return next(
      new AppError(
        "application failed this test you have to apply for retake test application",
        400,
      ),
    );
  }
  if (
    await service.doesPassTestType(
      req.body.local_driving_license_application_id,
      testAppointment.test_type_id,
    )
  ) {
    return next(new AppError("application already passed this test", 400));
  }
  if (
    !(await service.isThereAnActiveScheduledTest(
      req.body.local_driving_license_application_id,
      testAppointment.test_type_id,
    ))
  )
    return next(
      new AppError(
        "Schedule a test appointment for this application first",
        400,
      ),
    );

  next();
});
