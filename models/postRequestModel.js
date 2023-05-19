const mongoose = require("mongoose");
const postRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  bloodType: {
    type: String,
    required: [true, "Blood group is required"],
  },
  location: {
    type: String,
    required: [true, "City is required"],
  },
  message: {
    type: String,
    required: [true, "Description is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("PostRequest", postRequestSchema);
