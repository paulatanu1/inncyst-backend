const mongoose = require("mongoose");
const Address = require("../../common/address");

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
    contactPerson: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    address: Address,
    isAccredited: Boolean,
    accreditionValidUpto: String,
    // category: {
    //   type: String,
    //   enum: ["academic-research-lab", "corporate-lab", "accredited-lab"]
    // },
    accreditionCertificate: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    admin: {
      type: mongoose.Schema.ObjectId,
      ref: "LabUserSchema",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lab", Lab);
