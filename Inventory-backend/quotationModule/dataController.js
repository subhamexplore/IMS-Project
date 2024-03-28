const quotationModel = require("./schema");

exports.createQuotation = async (req, res) => {
  try {
    const newItemData = req.body;
    const newProductData = newItemData.items;
    delete newItemData.product;

    const newItem = new quotationModel(newItemData);

    await newItem.save();

    const newItemId = newItem._id;
    await quotationModel.findByIdAndUpdate(
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

exports.getQuotation = async (req, res) => {
  await quotationModel
    .find({})
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};
exports.deleteItem = async (req, res) => {
  await quotationModel
    .deleteOne({ _id: req.params.id })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};
