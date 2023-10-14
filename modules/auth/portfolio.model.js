const { Schema, model } = require("mongoose");

const portfolioSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  pdf: { type: String },
  image: [String],
  video: [String],
  url: [String],
});

module.exports = model("portfolio", portfolioSchema);
