const express = require("express");
const licenseController = require("../controllers/v1/licenseController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(licenseController.getAllLicenses)
  .post(licenseController.createLicense);
router.route("/search").get(licenseController.getByQuery);

router
  .route("/detained_licenses")
  .get(licenseController.getAllDetainedLicenses)
  .post(licenseController.detainLogic, licenseController.detainLicense);
// router
//   .route("/detain")
router
  .route("/:id")
  .get(licenseController.getLicenseById)
  .patch(licenseController.updateLicense)
  .delete(licenseController.deleteLicense);
router
  .route("/detained_licenses/:id")
  .patch(
    licenseController.handleReleaseLogic,
    licenseController.releaseDetainedLicense,
  );
module.exports = router;
router.route("/renew_license").post(licenseController.renewLicense);
router
  .route("/replace_license")
  .post(licenseController.replaceForDamagedOrLost);
