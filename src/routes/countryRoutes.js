const express = require("express");
const countryController = require("../controllers/v1/countryController");

const router = express.Router();

router
  .route("/")
  .get(countryController.getAllCountries)
  .post(countryController.createCountry);
router
  .route("/:id")
  .get(countryController.getOneCountry)
  .patch(countryController.updateCountry)
  .delete(countryController.deleteCountry);

module.exports = router;
