const mongoose = require("../mongooseConfig");

let cashSchema = new mongoose.Schema({
  adjustment: String,
  transferDate: String,
  enterAmount: Number,
  description: String,
});

let expenseSchema = new mongoose.Schema({
  sl: Number,
  vendorName: String,
  expenseCategory: String,
  expenseNo: Number,
  items: String,
  billDate: String,
  purchasePrice: Number,
});

const expenseModel = mongoose.model("expense", expenseSchema);
const cashModel = mongoose.model("cash", cashSchema);

module.exports = {
  expenseModel,
  cashModel,
};
