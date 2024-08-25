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
  lat: { type: String },
  lng: { type: String },
});

module.exports = Address;
