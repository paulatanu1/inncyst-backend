const mongoose = require("mongoose");

const Role = new mongoose.Schema({
  identifier: String,
  permission: [
    {
      name: String,
      value: Boolean,
      children: [{ name: String, value: Boolean }],
    },
  ],
});

module.exports = mongoose.model("Role", Role);
