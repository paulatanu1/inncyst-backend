const { Schema, model } = require("mongoose");

const industrySchema = Schema({
  industryId: { type: Schema.Types.ObjectId, ref: "Auth" },
  type: { type: String, enum: ["intranship", "job"], default: "intranship" },
  details: { type: String, required: true },
  skills: [],
  intranshipType: {
    type: String,
    enum: ["office", "hybrid", "remote"],
    default: "office",
  },
  startDate: { type: String },
  duration: { type: String, required: true },
  jobOpening: { type: Number, required: true },
  responsibilities: [],
  stipend: {
    type: String,
    enum: ["fixed", "unpaid", "paid"],
    default: "fixed",
  },
  salary: { type: Number, required: true },
  salaryType: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
  perks: { type: String },
  status: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("industryPost", industrySchema);
