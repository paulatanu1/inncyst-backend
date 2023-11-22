const { Schema, model } = require("mongoose");

const portfolioSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  pdf: { type: String, default: null },
  image: { type: String, default: null },
  video: { type: String, default: null },
  url: { type: String, default: null },
  youtubeUrl: { type: String, default: null },
  portfolioStatus: { type: String, enum: ['ongoing', 'complete'], default: 'ongoing' },
  createdAt: { type: Date, default: Date.now, },
  deletedAt: { type: Date, default: null }
});

module.exports = model("portfolio", portfolioSchema);
