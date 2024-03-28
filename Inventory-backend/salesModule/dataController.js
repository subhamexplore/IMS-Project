const salesModel = require("./schema");

exports.createSales = async (req, res) => {
  try {
    const newItemData = req.body;
    const newProductData = newItemData.items;
    delete newItemData.product;

    const newItem = new salesModel(newItemData);

    await newItem.save();

    const newItemId = newItem._id;
    await salesModel.findByIdAndUpdate(
      newItemId,
      { $push: { product: newProductData } },
      { new: true }
    );

    res.status(201).json({ message: "Item created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSales = async (req, res) => {
  await salesModel
    .find({})
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

exports.getBillItem = async (req, res) => {
  console.log(req.params);
  await salesModel
    .findOne({ uniqueId: req.params.uniqueCode })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

// exports.deleteListItem = async (req, res) => {
//   await salesModel
//     .deleteOne({ _id: req.params.id })
//     .then((result) => res.json(result))
//     .catch((err) => res.json(err));
// };
exports.deleteSales = async (req, res) => {
  await salesModel
    .deleteOne({ _id: req.params.id })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};
