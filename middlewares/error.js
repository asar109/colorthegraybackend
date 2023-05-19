const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statuscode = err.statuscode || 500;
  err.message = err.message || "Internal server Error";

  // // Wrong MongoDB id Error
  // if (err.name === "CastError") {
  //   const message = `Resource not found. Invalid: ${err.path}`;
  //   err = new ErrorHandler(message, 400);
  // }
  // // Duplicate key Error
  // if (err.code === 11000) {
  //   const message = `Duplicate key Entered`;
  //   err = new ErrorHandler(message, 400);
  // }
  // // Wrong JWT error
  // if (err.name === "JsonWebTokenError") {
  //   const message = `Json Web Token is invalid, Try again `;
  //   err = new ErrorHandler(message, 400);
  // }

  // // JWT EXPIRE error
  // if (err.name === "TokenExpiredError") {
  //   const message = `Json Web Token is Expired, Try again `;
  //   err = new ErrorHandler(message, 400);
  // }
  // // Type Error
  // if (err.name === "TypeError") {
  //   const message = `Error : ${err.name}`;
  //   err = new ErrorHandler(message, 400);
  // }

  res.status(err.statuscode).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};
