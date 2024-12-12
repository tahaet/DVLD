const jwt = require("jsonwebtoken");
const util = require("util");
const { Op } = require("sequelize");
const crypto = require("crypto");
const catchHandler = require("../../util/catchHandler");
const User = require("../../models/user");

const passwordUtil = require("../../util/passwordUtil");
const AppError = require("../../util/appError");
const Roles = require("../../util/roles");
const Email = require("../../util/email");
const Person = require("../../models/person");

function singToken(id, res) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRE_IN) * 1000 * 60 * 60 * 24,
    ),
    // sameSite: 'none', // Required for cross-origin cookies
  });

  return token;
}
exports.signUp = catchHandler(async (req, res, next) => {
  const newUser = await User.create({
    user_name: req.body.user_name,
    email: req.body.email,
    photo: req.body.photo,
    password: await passwordUtil.hashPassword(req.body.password),
    person_id: req.body.person_id,
    //passwordConfirm: req.body.passwordConfirm,
    // passwordChangedAt: req.body?.passwordChangedAt,
    role: req.body.role || Roles.USER,
    // account_confirm_Token: null,
  });
  // console.log(newUser);
  const confirmToken = passwordUtil.createConfirmToken(newUser);
  await newUser.save();

  const { email } = await Person.findByPk(newUser.person_id, {
    raw: true,
    attributes: ["email"],
  });
  await new Email(email, newUser.user_name).send(
    "Email Confirmation",
    `${req.protocol}://${req.get("host")}/api/v1/users/confirmEmail/${confirmToken}`,
  );

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
      message: `Please check your inbox ${email}`,
    },
  });
});
exports.resendConfirmToken = catchHandler(async (req, res, next) => {
  const user = await User.findOne({
    where: { user_name: req.body.user_name },
  });
  console.log(user);
  if (!user)
    return next(new AppError("this email is confirmed use another email", 400));
  if (user.is_confirmed) return next(new AppError("Please signup first", 400));
  const { email } = await Person.findByPk(user.person_id, {
    raw: true,
    attributes: ["email"],
  });
  const confirmToken = passwordUtil.createConfirmToken(user);
  await user.save();

  await new Email(email, user.user_name).send(
    "Email Confirmation",
    `${req.protocol}://${req.get("host")}/api/v1/users/confirmEmail/${confirmToken}`,
  );

  res.status(201).json({
    status: "success",
    data: {
      user: user,
      message: `Please check your inbox ${email}`,
    },
  });
});
exports.confirmEmail = catchHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(hashedToken);
  const user = await User.findOne({
    where: {
      account_confirm_token: hashedToken,
      account_confirm_expires: { [Op.gte]: Date.now() },
    },
  });

  if (!user)
    throw new AppError(
      "Token is invalid or has expired, please try again",
      400,
    );

  user.is_confirmed = true;
  // user.passwordConfirm = req.body.passwordConfirm;
  user.account_confirmToken = null;
  user.account_confirmExpires = null;
  // console.log(user.is_confirmed);
  await user.save();
  const token = singToken(user.user_id, res);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.login = catchHandler(async (req, res, next) => {
  const { user_name, password } = req.body;
  if (!user_name || !password)
    throw new AppError("Please provide email and password", 400);
  const user = await User.findOne({
    where: { user_name, is_active: true },
    raw: true,
    attributes: ["password"],
  });
  console.log(password);
  console.log(user);
  if (!user || !(await passwordUtil.comparePassword(password, user.password))) {
    throw new AppError("Incorrect email and/or password", 400);
  }
  if (!user.is_confirmed) {
    return next(new AppError(`Please confirm your email ${user_name}`, 404));
  }
  const token = singToken(user.user_id, res);

  res.status(200).json({
    status: "success",
    token: token,
  });
});
exports.protect = catchHandler(async (req, res, next) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt && req.cookies.jwt !== "loggedout") {
    token = req.cookies.jwt;
  }

  if (!token)
    // res.redirect("/login");
    throw new AppError(
      "You are not logged in! please log in an try again",
      401,
    );
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET || "",
  );
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser)
    throw new AppError("User that has this token is no longer exist", 404);

  if (passwordUtil.isPasswordChangedAfter(currentUser, decoded.iat))
    throw new AppError(
      "User has recently changed his password, please try again",
      401,
    );

  req.user = currentUser;
  req.body.created_by_user_id = currentUser.user_id;
  next();
});
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await util.promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET || "",
      );

      // 2) Check if user still exists
      const currentUser = await User.findByPk(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.isPasswordChangedAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
    secure: process.env.NODE_ENV === "production", // Secure in production
    // sameSite: 'lax', // Protect against CSRF
    // path: '/', // Ensure cookie is available across all paths
  });

  // Clear the Authorization header if it exists
  if (req.headers.authorization) {
    req.headers.authorization = "";
  }
  res.status(200).json({ status: "success" });
};
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      next(
        new AppError("You don't have permission to access this resource", 402),
      );

    next();
  };
exports.forgotPassword = catchHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    throw new AppError("There is no user with that email address", 404);

  const resetToken = passwordUtil.createPasswordResetToken(user);
  const resetURL = `${req.protocol}://${req.get(
    "host",
  )}/api/v1/users/resetPassword/${resetToken}`;
  await user.save();
  //const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500,
      ),
    );
  } finally {
    user.save({ validateBeforeSave: false });
  }
});

exports.resetPassword = catchHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: Date.now() },
    },
  });
  if (!user)
    throw new AppError(
      "Token is invalid or has expired, please try again",
      400,
    );
  // console.log(user);
  if (await passwordUtil.checkPassword(req.body.password, user.password))
    throw new AppError(
      "This is the same old password, please choose a new one",
      400,
    );
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();
  const token = singToken(user.user_id, res);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.updatePassword = catchHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  if (!user)
    throw new AppError("There is no user associated with that id", 404);

  if (
    !(await passwordUtil.checkPassword(req.body.currentPassword, user.password))
  ) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();
  const token = singToken(user.user_id, res);
  res.status(200).json({
    status: "success",
    token,
  });
});
// const excludeis_activeFilter = (req, res, next) => {
//   req.skipis_activeFilter = true;
//   next();
// };
exports.reactivateUserRequest = catchHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user)
    throw new AppError("There is no user associated with that email", 404);

  const activateToken = passwordUtil.createAccountActivateToken(user);
  try {
    await new Email(
      user,
      `${req.protocol}://${req.get("host")}/api/v1/users/activate/${activateToken}`,
    ).sendWelcome();
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Account Activation Link',
    //   message: `Click on the link below to activate your account: `,
    // });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.accountActivateToken = null;
    user.accountActivateExpires = null;
    console.log(err);
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500,
      ),
    );
  } finally {
    user.save({ validateBeforeSave: false });
  }
});
exports.activateAccount = catchHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    where: {
      accountActivateToken: hashedToken,
      accountActivateExpires: { [Op.gt]: Date.now() },
    },
  });
  if (!user)
    throw new AppError(
      "Token is invalid or has expired, please try again",
      400,
    );

  user.is_active = true;
  user.passwordConfirm = req.body.passwordConfirm;
  user.accountActivateToken = null;
  user.accountActivateExpires = null;
  await user.save();
  const token = singToken(user.user_id, res);
  res.status(200).json({
    status: "success",
    token,
  });
});
