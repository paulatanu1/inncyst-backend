const mongoose = require("mongoose");

const TestRequest = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["drafting", "received", "onhold", "approved"],
      default: "drafting"
    },
    selectedFormId: {
      type: mongoose.Schema.ObjectId,
      ref: "Forms",
    },
    selectedCustomerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Customers",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    // admin: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "LabUserSchema",
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestRequest", TestRequest);
