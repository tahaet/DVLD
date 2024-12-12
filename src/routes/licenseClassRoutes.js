const express = require("express");
const licenseClassController = require("../controllers/v1/licenseClassController");

const router = express.Router();

router
  .route("/")
  .get(licenseClassController.getAllLicenseClasses)
  .post(licenseClassController.createLicenseClass);
router
  .route("/:id")
  .get(licenseClassController.getOneLicenseClass)
  .patch(licenseClassController.updateLicenseClass)
  .delete(licenseClassController.deleteLicenseClass);

module.exports = router;
