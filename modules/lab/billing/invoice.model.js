const mongoose = require("mongoose");

const Invoice = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    invoice: { type: String, required: true },
    orderNumber: String,
    invoiceDate: { type: Date, required: true },
    terms: { type: String, required: true },
    dueDate: { type: Date, required: true },
    salesPerson: String,
    itemDetails: [
      {
        name: String,
        value: Boolean,
      },
    ],
    customerNotes: String,
    draft: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", Invoice);
