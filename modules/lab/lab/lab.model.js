const mongoose = require("mongoose");
const Address = require("../../common/address");
const userType = require("../../common/userType");

const Lab = new mongoose.Schema(
  {
    labName: {
      type: String,
      required: [true, "'labName' is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "'workEmail' is required"],
      trim: true,
    },
    password:{ type: String, required: [true, "'password' is required"],},
    contactPerson: {
      type: String,
      trim: true,
    },
    phoneNumbers: [String],
    address: Address,
    isAccredited: Boolean,
    accreditionValidUpto: String,
    category: {
      type: String,
      enum: ["academic-research-lab", "corporate-lab", "accredited-lab"]
    },
    affiliation: { type: String, required: true },
    accreditionCertificate: String,
    logo: { type: String, default: null },
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    // },
    labDescription: { type: String, required: true },
    labWebsite: { type: String },
    status: { type: Boolean, default: true },
    token: { type: String, default: null },
    role: { type: String, default: userType.LAB },
    // admin: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "LabUserSchema",
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lab", Lab);
