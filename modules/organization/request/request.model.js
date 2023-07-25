const mongoose = require("mongoose");

const RequestLabpool = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    request: { type: mongoose.Schema.ObjectId, ref: "Lab", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RequestLabpool", RequestLabpool);
