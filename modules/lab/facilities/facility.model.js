const mongoose = require("mongoose");

const Facilities = new mongoose.Schema({
  facilityName: {
    type: String,
    required: [true, "'facilityName' is required"],
    trim: true,
  },
  category: {
    type: String,
  },
  description: String,
  modelNumber: String,
  make: Date,
  yearOfManufacturing: Date,
  labId: {
    type: mongoose.Schema.ObjectId,
    ref: "LabManager",
    required: true,
  },
  profileId: {
    type: mongoose.Schema.ObjectId,
    ref: "LabProfile",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Facilities", Facilities);
