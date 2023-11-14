const { Schema, model } = require("mongoose");

const industrySchema = Schema({
  industryId: { type: Schema.Types.ObjectId, ref: "Auth" },
  type: { type: String, enum: ["intranship", "job"] },
  details: { type: String },
  skills: [],
  intranshipType: {
    type: String,
    enum: ["office", "hybrid", "remote"]
  },
  startDate: { type: String },
  duration: { type: String },
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
