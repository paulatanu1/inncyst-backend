const mongoose = require("mongoose");

const Request = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.ObjectId,
    ref: "Lab",
  },
});

const Organization = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "'companyName' is required"],
    trim: true,
  },
  workEmail: {
    type: String,
    required: [true, "'workEmail' is required"],
    trim: true,
  },
  contactPersonName: {
    type: String,
    required: [true, "'contactPersonName' is required"],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "'phoneNumber' is required"],
    trim: true,
  },
  referenceLink: String,
  requests: [Request],
  street: String,
  area: String,
  state: String,
  city: String,
  pincode: {
    type: Number,
    maxlength: 6,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A lab with the same user information already exists"],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Organization", Organization);
