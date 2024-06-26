const { Schema, model } = require("mongoose");

const settingsSchema = Schema({
  contentType: {
    type: "string",
    enum: ["privacy", "refund"],
    default: "refund",
  },
  content: { type: "string", required: true },
  image: { type: "string" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("settings", settingsSchema);
