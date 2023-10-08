const { Schema, model } = require("mongoose");

const contactUsSchema = Schema({
  firstName: { type: String, require: [true, "firstName is required"] },
  lastName: { type: String, require: [true, "lastName is required"] },
  email: {
    type: String,
    lowercase: true,
    require: [true, "email is required"],
  },
  message: {
    type: String,
    maxlength: 200,
    require: [true, "message is required"],
  },
  status: { type: Boolean, default: true, },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("contact", contactUsSchema);
