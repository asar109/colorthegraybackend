const JWT = require("jsonwebtoken");
const tryCatch = require("./tryCatchfuntion");
const ErrorHandler = require("./errorHandler");
const UserModel = require("../models/userModel");
// Check authentication
exports.isAuthenticated = tryCatch(async (req, res, next) => {
  // check token existence
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login first"));
  }

  // It will decode _id into an object
  const decoded = JWT.verify(token, process.env.SECRET_KEY);
  req.user = await UserModel.findById({ _id: decoded.id });
  next();
});
