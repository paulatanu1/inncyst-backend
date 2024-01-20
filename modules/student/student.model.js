const { Schema, model } = require("mongoose");

const studentSchema = Schema({
  jobId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "Auth" },
  studentName: { type: String },
  email: { type: String },
  phone: { type: String },
  resume: { type: String, required: true },
  availability: { type: Number, default: 1 },
  status: { type: Boolean, default: false },
  applicationId: { type: String },
  applicationStatus: {
    type: String,
    enum: [
      "pending",
      "interviewScheduled",
      "hired",
      "notSelected",
      "rejected",
      "sortListed"
    ],
    default: "pending",
  },
  availability_message: { type: String, default: null },
});

module.exports = model("student", studentSchema);
