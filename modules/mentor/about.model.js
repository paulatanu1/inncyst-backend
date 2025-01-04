const { Schema, model } = require("mongoose");

const mentorSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "Auth" },
  name: { type: String, required: true },
  heading: { type: String, required: true },
  workRole: { type: String, required: true },
  about: { type: String, required: true },
  location: { type: String, required: true },
  state: { type: String, required: true },
  language: { type: String, required: true },
  status: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("mentorAbout", mentorSchema);
