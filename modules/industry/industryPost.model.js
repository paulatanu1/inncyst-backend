const { Schema, model } = require("mongoose");

const industrySchema = Schema({
  industryId: { type: Schema.Types.ObjectId, ref: "Auth" },
  company: {type: Schema.Types.ObjectId, ref: "industry" },
  title: { type: String },
  type: { type: String, enum: ["intranship", "job"] },
  details: { type: String, default: null },
  skills: [],
  intranshipType: {
    type: String,
    enum: ["office", "hybrid", "remote"], default: "office"
  },
  jobType: {
    type: String,
    enum: ["partTime", "fullTime"], default: "fullTime"
  },
  startDate: { type: String },
  education: { type: String, enum: ['diploma', 'hs', 'master', 'bachelor'] },
  duration: { type: String },
  durationIn: { type: String, enum: ["monthly", "yearly"], default: 'monthly' },
  experience: { type: Number },
  experienceTime: { type: String, enum: ["months", "years"]},
  jobOpening: { type: Number },
  responsibilities: [],
  stipend: {
    type: String,
    enum: ["fixed", "unpaid", "paid", "negotiable", "performanceBased"], default: 'fixed'
  },
  salary: { type: Number, default: null },
  salaryIn: { type: Number, default: null },
  salaryType: { type: String, enum: ["monthly", "yearly"], default: 'monthly' },
  salaryCtcDescription: {
    currency: { type: String, enum: ["inr"], default: "inr" },
    ctcFrom: { type: String, default: null },
    ctcTo: { type: String, default: null },
    ctcType: { type: String, default: "yearly" },
    isProbationPeriod: { type: Boolean, default: false },
    perks: [String]
  },
  perks: [],
  location: { type: String },
  status: { type: Boolean, default: false },
  coverLetter: {
    letter: { type: String, default: null },
    availability: { type: String, default: null },
    moreQuestions: [String]
  },
  addtionalCandidatePreference: { type: String, default: null },
  description: { type: String, default: null },
  alternativePhone: { type: String, default: null },
  womanRestart: { type: String, default: null },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("industryPost", industrySchema);
