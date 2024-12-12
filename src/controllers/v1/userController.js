const handlerFactory = require("./handlerFactory");
const User = require("../../models/user");
const catchHandler = require("../../util/catchHandler");
const AppError = require("../../util/appError");

exports.getAllUsers = handlerFactory.getAll(User);

exports.getUserById = handlerFactory.getOneById(User);

exports.deleteUser = handlerFactory.deleteOne(User);
exports.updateMe = catchHandler(async (req, res, next) => {
  if (req.body.password)
    throw new AppError(
      "This route is not for password updates. Please use /updateMyPassword.",
      400,
    );
  const filteredBody = { email: req.body.email, name: req.body.name };
  // if (req.file) filteredBody.photo = req.file.filename;

  let user = await User.findByPk(req.user.id);
  user = await User.update(filteredBody);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route will not be defined, please use signup instead",
  });
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.deleteMe = catchHandler(async (req, res, next) => {
  await User.destroy({ where: { user_id: req.user.id, is_active: true } });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateUser = handlerFactory.updateOne(User);
