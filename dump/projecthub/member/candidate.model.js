const mongoose = require("mongoose");

const Member = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "The first name of the author is required"],
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  dob: {
    type: Date,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  alternateEmail: {
    type: String,
    trim: true,
    unique: true,
  },
  mobileNumber: {
    type: String,
    trim: true,
  },
  alternateMobileNumber: {
    type: String,
    trim: true,
  },
  projectId: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Author", Member);
