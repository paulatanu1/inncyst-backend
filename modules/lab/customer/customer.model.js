const mongoose = require("mongoose");

const OtherDetails = new mongoose.Schema({
  pan: { type: String },
  currency: { type: String },
  paymentTerms: { type: String },
});
const BillingAddress = mongoose.Schema({
  attention: { type: String },
  region: { type: String },
  address1: { type: String },
  address2: String,
  city: { type: String },
  state: { type: String },
  zipcode: { type: String },
  phone: { type: Number },
  fax: String,
});
const ShippingAddress = mongoose.Schema({
  attention: { type: String },
  region: { type: String },
  address1: { type: String },
  address2: String,
  city: { type: String },
  state: { type: String },
  zipcode: { type: String },
  phone: { type: Number },
  fax: String,
});
const Address = new mongoose.Schema({
  billingAddress: BillingAddress,
  shippingAddress: ShippingAddress,
});

const Customers = new mongoose.Schema(
  {
    customerType: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    displayName: String,
    email: { type: String },
    workPhone: Number,
    mobile: { type: Number },
    unitType: String,
    otherDetails: OtherDetails,
    address: Address,
    remarks: String,
    gst_number: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customers", Customers);
