const express = require("express");
const testController = require("../controllers/v1/testController");
const testRouter = require("./testRoutes");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(testController.getAllTests)
  .post(testController.handleTestLogic, testController.createTest);
router
  .route("/:id")
  .get(testController.getOneTest)
  .patch(testController.updateTest)
  .delete(testController.deleteTest);

module.exports = router;
