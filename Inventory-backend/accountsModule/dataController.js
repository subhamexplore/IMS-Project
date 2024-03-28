const { expenseModel, cashModel } = require("./schema");

exports.createExpense = async (req, res) => {
  console.log(req);
  try {
    const newItem = new expenseModel(req.body);
    await newItem.save();

    res.status(201).json({ message: "Item created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getExpense = async (req, res) => {
  await expenseModel
    .find({})
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

exports.createCash = async (req, res) => {
  console.log(req);
  try {
    const newItem = new cashModel(req.body);
    await newItem.save();

    res.status(201).json({ message: "Item created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getCash = async (req, res) => {
  await cashModel
    .find({})
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

exports.deleteExpItem = async (req, res) => {
  await expenseModel
    .deleteOne({ _id: req.params.id })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

exports.deleteListItem = async (req, res) => {
  await cashModel
    .deleteOne({ _id: req.params.id })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};
