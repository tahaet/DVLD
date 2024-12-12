const express = require("express");
const testAppointmentRouter = require("./testAppointmentRoutes");
const licenseRouter = require("./licenseRoutes");
const localDrivingLicenseApplicationController = require("../controllers/v1/localDrivingLicenseApplicationController");
const applicationController = require("../controllers/v1/applicationController");

const router = express.Router();

router
  .route("/")
  .get(
    localDrivingLicenseApplicationController.getAllLocalDrivingLicenseApplications,
  )
  .post(
    applicationController.doesPersonHasActiveApplication,
    applicationController.createApplication,
    localDrivingLicenseApplicationController.createLocalDrivingLicenseApplication,
  );
router
  .route("/search")
  .get(
    localDrivingLicenseApplicationController.getLocalDrivingLicenseApplicationBy,
  );
router
  .route("/:id")
  .get(
    localDrivingLicenseApplicationController.getLocalDrivingLicenseApplicationBy,
  )
  .patch(
    localDrivingLicenseApplicationController.updateLocalDrivingLicenseApplication,
  )
  .delete(
    localDrivingLicenseApplicationController.deleteLocalDrivingLicenseApplication,
  );
router.use("/:local_application_id/licenses", licenseRouter);
router.use("/:application_id/test_appointments", testAppointmentRouter);
module.exports = router;
