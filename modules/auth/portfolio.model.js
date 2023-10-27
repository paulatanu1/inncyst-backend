const { Schema, model } = require("mongoose");

const portfolioSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  pdf: { type: String, default: null },
  image: { type: String, default: null },
  video: { type: String, default: null },
  url: [String],
  createdAt: { type: Date, default: Date.now, },
});

module.exports = model("portfolio", portfolioSchema);
