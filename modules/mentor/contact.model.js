const { Schema, model } = require("mongoose");

const mentorContactSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "Auth" },
  email: { type: String },
  phone: { type: String },
  linkedin: { type: String },
  github: { type: String },
  dribble: { type: String },
  youtube: { type: String },
  behance: { type: String },
  instagram: { type: String },
  status: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("mentorContact", mentorContactSchema);
