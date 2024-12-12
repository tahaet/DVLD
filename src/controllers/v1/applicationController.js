const handlerFactory = require("./handlerFactory");
const Application = require("../../models/application");
const LocalDrivingLicenseApplicationsView = require("../../models/localDrivingLicenseApplicationView");
const AppError = require("../../util/appError");

exports.getAllApplications = handlerFactory.getAll(Application);
exports.getApplicationById = handlerFactory.getOneById(Application);
exports.createApplication = handlerFactory.createOne(Application);
exports.updateApplication = handlerFactory.updateOne(Application);
exports.deleteApplication = handlerFactory.deleteOne(Application);
exports.getByQuery = handlerFactory.getOneBy(Application);
exports.getAllFomView = handlerFactory.getAll(
  LocalDrivingLicenseApplicationsView,
);
exports.doesPersonHasActiveApplication = catchHandler(
  async (req, res, next) => {
    const resObj = await fetch(
      `http://localhost:3000/api/v1/applications/search?applicant_person_id=${req.body.applicant_person_id}&application_type_id=${req.body.application_type_id}&application_status=1`,
    );
    console.log(resObj);
    if (resObj.ok)
      return next(
        new AppError(
          "There is an active application for the same service for this person",
          404,
        ),
      );
    return next();
  },
);
