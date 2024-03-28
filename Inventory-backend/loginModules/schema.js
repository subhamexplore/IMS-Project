const mongoose = require("../mongooseConfig");

let dbSchema = new mongoose.Schema({
  username: String,
  password: String,
  isRemember: String,
  mobile: String,
  email: String,
});

let mpinSchema = new mongoose.Schema({
  mpin: String,
});

const logInModel = mongoose.model("logIn", dbSchema);
const mpinModel = mongoose.model("mpin", mpinSchema);

module.exports = { logInModel, mpinModel };
