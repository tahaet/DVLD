const bcrypt = require("bcrypt");
const crypto = require("crypto");

module.exports.hashPassword = async (password) =>
  await bcrypt.hash(password, 12);
module.exports.comparePassword = async (inputPassword, userPassword) =>
  await bcrypt.compare(inputPassword, userPassword);
module.exports.isPasswordChangedAfter = (currentUser, JwtTimestamp) => {
  if (currentUser.password_changed_at) {
    const changedTimestamp = Math.floor(
      currentUser.password_changed_at.getTime() / 1000,
    );
    return changedTimestamp > JwtTimestamp;
  }
  return false;
};
module.exports.createPasswordResetToken = (currentUser) => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  currentUser.password_reset_token = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  currentUser.password_reset_expires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};
module.exports.createAccountActivateToken = (currentUser) => {
  const activateToken = crypto.randomBytes(32).toString("hex");

  currentUser.account_activate_token = crypto
    .createHash("sha256")
    .update(activateToken)
    .digest("hex");
  currentUser.account_activate_expires = new Date(Date.now() + 10 * 60 * 1000);

  return activateToken;
};

module.exports.createConfirmToken = (currentUser) => {
  const confirmToken = crypto.randomBytes(32).toString("hex");
  currentUser.account_confirm_token = crypto
    .createHash("sha256")
    .update(confirmToken)
    .digest("hex");
  currentUser.account_confirm_expires = new Date(Date.now() + 10 * 60 * 1000);
  return confirmToken;
};
