const User = require("../models/userModel");
const sendCokie = require("../utils/sendCookie");
const tryCatchfuntion = require("../utils/tryCatchfuntion");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

// Register a new user
exports.registerUser = tryCatchfuntion(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  sendCokie(user, 200, res);
});

// log in user

exports.loginUser = tryCatchfuntion(async (req, res, next) => {
  const { email, password } = req.body;

  // Check that email and password both are given

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter email and password", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // compare password from Database

  const isPasswordMatch = await user.comparePass(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Sign in if all above conditions are meet

  sendCokie(user, 201, res);
});

//  User log out

exports.logoutUser = tryCatchfuntion(async (req, res, next) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(201).send({
    success: true,
    message: "Logged out Successfully",
  });
});

// Get user profile

exports.getUserProfile = tryCatchfuntion(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).send({
    success: true,
    user,
  });
});

// Forgot Password

exports.forgotPassword = tryCatchfuntion(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).send({ error: "Please enter email" });
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send({ error: "User not found" });

  // generate OTP

  const originalToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Send Email

  const url = `${process.env.FRONTEND_URL}/reset/password/${originalToken}`;
  const subject = "ColorTheGray| Password Recovery";
  const message = `Your password reset token is as follow:\n\n${url}\n\nIf you have not requested this email, then ignore it.`;
  await sendEmail(email, message, subject);
  res.status(200).json({
    success: true,
    message: `Email sent`,
  });
});

// Reset Password

exports.resetPassword = tryCatchfuntion(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user)
    return next(new ErrorHandler("Token is invalid or has been expired", 401));
  if (req.body.newPassword !== req.body.confirmPassword)
    return next(new ErrorHandler("Password does not match", 400));
  user.password = req.body.newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
  });
});

// get my profile

exports.getMyProfile = tryCatchfuntion(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).send({
    success: true,
    user,
  });
});

//  sign in with google

exports.googleLogin = tryCatchfuntion(async (req, res, next) => {
  const { userEmail, userName, googleId } = req.body;

  const user = await User.findOne({ googleId });
  if (user) {
    sendCokie(user, 200, res);
  } else {
    const password = userEmail + process.env.SECRET_KEY;
    const newUser = await User.create({
      name: userName,
      email: userEmail,
      password,
      googleId,
    });
    sendCokie(newUser, 200, res);
  }
});
