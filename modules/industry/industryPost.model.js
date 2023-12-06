const { Schema, model } = require("mongoose");

const industrySchema = Schema({
  industryId: { type: Schema.Types.ObjectId, ref: "Auth" },
  company: {type: Schema.Types.ObjectId, ref: "industry" },
  type: { type: String, enum: ["intranship", "job"] },
  details: { type: String, default: null },
  skills: [],
  intranshipType: {
    type: String,
    enum: ["office", "hybrid", "remote"], default: "office"
  },
  startDate: { type: String, default: null },
  education: { type: String, enum: ['diploma', 'hs', 'master', 'bachelor'], default: null },
  duration: { type: String, default: null },
  durationIn: { type: String, enum: ["monthly", "yearly"], default: 'monthly' },
  experience: { type: Number },
  experienceTime: { type: String, enum: ["months", "years"], default: null },
  jobOpening: { type: Number, default: null },
  responsibilities: [],
  stipend: {
    type: String,
    enum: ["fixed", "unpaid", "paid"], default: 'fixed'
  },
  salary: { type: Number, default: null },
  salaryType: { type: String, enum: ["monthly", "yearly"], default: 'monthly' },
  perks: [],
  location: { type: String, default: null },
  status: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("industryPost", industrySchema);
