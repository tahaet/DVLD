const express = require("express");
const countryController = require("../controllers/v1/applicationTypeController");

const router = express.Router();

router
  .route("/")
  .get(countryController.getAllApplicationTypes)
  .post(countryController.createApplicationType);
router
  .route("/:id")
  .get(countryController.getOneApplicationType)
  .patch(countryController.updateApplicationType)
  .delete(countryController.deleteApplicationType);

module.exports = router;
