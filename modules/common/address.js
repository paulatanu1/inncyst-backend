const mongoose = require("mongoose");

const Address = new mongoose.Schema({
  street: String,
  area: String,
  state: String,
  city: String,
  pincode: {
    type: Number,
    maxlength: 6,
  },
});

module.exports = Address;
