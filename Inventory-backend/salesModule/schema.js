const mongoose = require("../mongooseConfig");

const ProductSchema = new mongoose.Schema({
  itemName: String,
  hsnCode: String,
  quantity: String,
  price: String,
  discount: String,
  size: String,
  amount: String,
  sgst: String,
  cgst: String,
});

const salesSchema = new mongoose.Schema({
  customerName: String,
  mobile: String,
  salesOrderNo: String,
  salesOrderDate: String,
  uniqueId: String,
  product: [ProductSchema],
  method: String,
  totalGST: String,
  totalDiscount: String,
  totalAmount: String,
});

const salesModel = mongoose.model("sale", salesSchema);

module.exports = salesModel;
