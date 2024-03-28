const Razorpay = require("razorpay");
const axios = require("axios");

exports.createRazor = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }
    res.json(order);
  } catch (err) {
    res.status(500).send("Error");
  }
};

exports.getRazor = async (req, res) => {
  try {
    const paymentsResponse = await axios.get(
      "https://api.razorpay.com/v1/payments",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.RAZORPAY_KEY_ID + ":" + process.env.RAZORPAY_SECRET_KEY
          ).toString("base64")}`,
        },
      }
    );

      res.json(paymentsResponse.data);
    
  } catch (err) {
    res.json(err);
  }
};
