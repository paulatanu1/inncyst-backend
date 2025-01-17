const { Schema, model } = require("mongoose");

const skillsSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "Auth" },
  skills: [],
  tools: [],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('mentorSkills', skillsSchema);