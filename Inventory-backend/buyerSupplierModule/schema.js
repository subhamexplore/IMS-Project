const mongoose = require("../mongooseConfig");

let buyerSupplierSchema = new mongoose.Schema({
  name: String,
  mobileNumber: String,
  email: String,
  category: String,
  payAmount: Number,
  gstin: String,
  panNumber: String,
  billingAddress: String,
  shippingAddress: String,
  creditPeriod: Number,
  collectAmount: Number,
});

const buyerSupplierModel = mongoose.model("buyerSupplier", buyerSupplierSchema);

module.exports = buyerSupplierModel;
