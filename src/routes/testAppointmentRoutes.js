const express = require("express");
const testAppointmentController = require("../controllers/v1/testAppointmentController");
const testRouter = require("./testRoutes");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(testAppointmentController.getAllTestAppointments)
  .post(
    testAppointmentController.handleTestLogic,
    testAppointmentController.createTestAppointment,
  );
router
  .route("/:id")
  .get(testAppointmentController.getOneTestAppointment)
  .patch(testAppointmentController.updateTestAppointment)
  .delete(testAppointmentController.deleteTestAppointment);

router.use("/:appointment_id/tests", testRouter);

module.exports = router;
