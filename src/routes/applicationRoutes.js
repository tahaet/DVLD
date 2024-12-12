const express = require("express");
const applicationController = require("../controllers/v1/applicationController");

const router = express.Router();

router
  .route("/")
  .get(applicationController.getAllApplications)
  .post(applicationController.createApplication);
router.route("/search").get(applicationController.getByQuery);
router
  .route("/:id")
  .get(applicationController.getApplicationById)
  .patch(applicationController.updateApplication)
  .delete(applicationController.deleteApplication);

module.exports = router;
