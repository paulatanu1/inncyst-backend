const { Schema, model } = require("mongoose");

const industrySchema = Schema({
  industryId: { type: Schema.Types.ObjectId, ref: "Auth" },
  company: {type: Schema.Types.ObjectId, ref: "industry" },
  type: { type: String, enum: ["intranship", "job"] },
  details: { type: String },
  skills: [],
  intranshipType: {
    type: String,
    enum: ["office", "hybrid", "remote"]
  },
  startDate: { type: String },
  education: { type: String, enum: ['diploma', 'hs', 'master', 'bachelor'] },
  duration: { type: String },
  durationIn: { type: String, enum: ["monthly", "yearly"] },
  experience: { type: Number },
  experienceTime: { type: String, enum: ["months", "years"] },
  jobOpening: { type: Number },
  responsibilities: [],
  stipend: {
    type: String,
    enum: ["fixed", "unpaid", "paid"]
  },
  salary: { type: Number },
  salaryType: { type: String, enum: ["monthly", "yearly"] },
  perks: [],
  location: { type: String },
  status: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("industryPost", industrySchema);
