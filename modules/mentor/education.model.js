const { Schema, model } = require("mongoose");

const mentorEducationSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "Auth" },
  degree: { type: String, required: true },
  organization: { type: String, required: true },
  studyField: { type: String, required: true },
  completionYear: { type: Date, required: true },
  status: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("mentorEducation", mentorEducationSchema);
