const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [4, "Write your full name"],
    maxlength: [30, "Name should not more than 30 char"],
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Please enter your email"],
    validate: [validator.isEmail, "please Enter a valid Email"],
  },
  password: {
    type: String,
    minlength: [8, "Password must be more than 8 characters"],
    required: true,
  },
  avatar: {
    public_id: String,
    url: String,
  },
  googleId: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  subcription: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

// get JWT Sign
userSchema.methods.getJWT = function () {
  return JWT.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRE_IN_DAYS,
  });
};

// compare password
userSchema.methods.comparePass = async function (enteredPass) {
  return await bcryptjs.compare(enteredPass, this.password);
};
//

userSchema.methods.getResetPasswordToken = function () {
  // generate token
  const token = crypto.randomBytes(20).toString("hex");
  // hash and set to resetPasswordToken field and set expire
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return token;
};

module.exports = mongoose.model("User", userSchema);
