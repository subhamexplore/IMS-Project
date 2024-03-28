const mongoose = require("../mongooseConfig");

const BatchSchema = new mongoose.Schema({
  batchNumber: String,
  size: String,
  stockQty: Number,
});

const inventorySchema = new mongoose.Schema({
  itemName: String,
  itemCode: String,
  itemDescription: String,
  sizes: String,
  salesPrice: Number,
  purchasePrice: Number,
  measuringUnit: String,
  openingStock: Number,
  openingStockRate: Number,
  gstTax: Number,
  reorderPoint: Number,
  file: String,
  category: String,
  scannedBarCode: [],
  batch: [BatchSchema],
});

const inventoryModel = mongoose.model("inventory", inventorySchema);

module.exports = inventoryModel;
