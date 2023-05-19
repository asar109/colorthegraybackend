const mongoose = require("mongoose");
const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlenth: [3, "Title must be at least 3 characters long"],
    maxlenth: [50, "Title must be at most 50 characters long"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlenth: [3, "Description must be at least 3 characters long"],
    maxlenth: [500, "Description must be at most 500 characters long"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Experience", experienceSchema);
