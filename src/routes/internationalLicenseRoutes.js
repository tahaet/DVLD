const express = require("express");
const internationalLicenseController = require("../controllers/v1/internationalLicenseController");

const router = express.Router();

router
  .route("/")
  .get(internationalLicenseController.getAllInternationalLicenses)
  .post(
    internationalLicenseController.handInternationalLicenseLogic,
    internationalLicenseController.createInternationalLicense,
  );
router.route("/search").get(internationalLicenseController.getByQuery);
router
  .route("/:id")
  .get(internationalLicenseController.getInternationalLicenseById)
  .patch(internationalLicenseController.updateInternationalLicense)
  .delete(internationalLicenseController.deleteInternationalLicense);

module.exports = router;
