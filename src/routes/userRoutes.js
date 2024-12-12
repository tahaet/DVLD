const express = require("express");
const userController = require("../controllers/v1/userController");
const authController = require("../controllers/v1/authController");
const User = require("../models/user");
const Roles = require("../util/roles");
// import multer from 'multer';
const router = express.Router();
// const upload = multer({ dest: `${__dirname}/../public/img/users` });

router.get("/logout", authController.logout);
router.post("/signup", authController.signUp);
router.get("/confirmEmail/:token", authController.confirmEmail);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post(
  "/activateAccountRequest",
  //authController.excludeActiveFilter,
  authController.reactivateUserRequest,
);
router.patch("/resetPassword/:token", authController.resetPassword);
router.post("/activateAccount/:token", authController.activateAccount);
router.post("/resendConfirmToken", authController.resendConfirmToken);
router.patch(
  "/changePassword",
  authController.protect,
  authController.updatePassword,
);
router.use(authController.protect);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);
router.get("/me", userController.getMe, userController.getUserById);

router.use(authController.restrictTo(Roles.ADMIN));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(async (req, res, next) => {
    // await models.User.sync({ alter: true });
    const result = await User.findByPk(req.params.id);
    res.json(result);
  })
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
