const mongoose = require("mongoose");

const Inventory = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    category: String,
    quantity: String,
    description: String,
    modelNumber: String,
    make: Date,
    yearOfManufacturing: Date,
    isRentable: Boolean,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", Inventory);
