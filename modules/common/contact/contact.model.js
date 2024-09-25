const { Schema, model } = require("mongoose");

const contactUsSchema = Schema({
  firstName: { type: String, require: [true, "First Name is required"] },
  lastName: { type: String, require: [true, "Last Name is required"] },
  email: {
    type: String,
    lowercase: true,
    require: [true, "email is required"],
  },
  phone: { type: String, require: [true, "phone is required"] },
  message: {
    type: String,
    maxlength: 200,
    require: [true, "message is required"],
  },
  status: { type: Boolean, default: true, },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("contact", contactUsSchema);
