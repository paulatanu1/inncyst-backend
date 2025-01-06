const { Schema, model } = require("mongoose");

const mentorExprienceSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "Auth" },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  currentWork: { type: Boolean, default: false },
  aboutRole: { type: String, required: true },
  url: { type: String, required: true },
  status: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("mentorExprience", mentorExprienceSchema);
