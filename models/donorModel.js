const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema({
  name: String,
  phone: String,
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  age: String,
  city: String,
  ispaid: String,
  
  lastDonation: Date,
  eligibility: {
    type: Boolean,
  },
  longitude: Number,
  latitude: Number,
  userId:{
    type : String,
    unique : [true, "You already registered as a donor"]
  },
});

module.exports = mongoose.model("Donor", DonorSchema);
