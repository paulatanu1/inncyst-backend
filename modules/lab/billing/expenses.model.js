const mongoose = require("mongoose");

const Expenses = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    invoice: { type: String, required: true },
    customerName: { type: String, required: true },
    notes: String,
    draft: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expenses", Expenses);
