const mongoose = require("mongoose");

const Facilities = new mongoose.Schema({
  facilityName: {
    type: String,
    required: [true, "'facilityName' is required"],
    trim: true,
  },
  category: {
    type: String,
    enum: [
      "synthesisFacility",
      "analyticalFacility",
      "testingMeasurementFacility",
      "calibrationFacility",
      "computationalFacility",
      "manufacturingFacility",
      "N/A",
    ],
    default: "N/A",
  },
  description: { type: String, required: true },
  modelNumber: String,
  make: Date,
  yearOfManufacturing: Date,
  softwareLicenceDetails: { type: String, required: true },
  userManual: { type: String, default: null },
  specificGuideline: { type: String, default: null },
  image: { type: String, default: null },
  lab: {
    type: mongoose.Schema.ObjectId,
    ref: "Lab",
    required: true,
  },
  status: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Facilities", Facilities);
