const { Schema, model } = require("mongoose");

const mentorExprienceSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "Auth" },
  title: { type: String, required: true },
  organization: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  present: { type: Boolean, default: false },
  aboutRole: { type: String, required: true },
  status: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("mentorExprience", mentorExprienceSchema);
