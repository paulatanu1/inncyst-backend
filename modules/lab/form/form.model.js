const mongoose = require("mongoose");

const Field = new mongoose.Schema({
  type: String,
  name: String,
  label: String,
  placeholder: String,
  cols: Number,
  child: [
    {
      type: String,
      name: String,
      label: String,
      placeholder: String,
    },
  ],
});

const Form = new mongoose.Schema(
  {
    fields: [Field],
    formName: { type: String, required: true, unique: true },
    formType: { type: String, required: true },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    // admin: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "LabUserSchema",
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Forms", Form);
