const express = require("express");
const personController = require("../controllers/v1/personController");

const router = express.Router();
router
  .route("/")
  .get(personController.getAllPeople)
  .post(
    personController.uploadPersonPhoto,
    personController.resizePersonPhoto,
    personController.createPerson,
  );
router.route("/search").get(personController.getBy);
router
  .route("/:id")
  .get(personController.getPersonById)
  .patch(personController.updatePerson, personController.deleteImage)
  .delete(personController.deleteImage, personController.deletePerson);

module.exports = router;
