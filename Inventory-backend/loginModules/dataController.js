// logInModelController.js
const { logInModel, mpinModel } = require("./schema");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.getLogin = async (req, res) => {
  try {
    try {
      const user = await logInModel.findOne({
        username: req.body.username,
      });

      await logInModel.updateOne(
        { username: req.body.username },
        { $set: { isRemember: req.body.isRemember } }
      );

      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      );

      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

      const inputPassword = req.body.password;

      if (originalPassword != inputPassword) {
        res.json("failure");
      } else {
        const accessToken = jwt.sign(
          {
            id: user._id,
            isRemember: user.isRemember,
          },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
        );

        res.status(200).json({ accessToken });
      }
    } catch (err) {
      res.json("failure");
    }
  } catch (err) {
    res.json(err);
  }
};

exports.createMpin = async (req, res) => {
  try {
    await mpinModel.create({
      mpin: CryptoJS.AES.encrypt(
        req.body.mpin,
        process.env.PASS_MPIN
      ).toString(),
    });
    res.json("success");
  } catch (err) {
    console.log(err);
  }
};

exports.getMpin = async (req, res) => {
  const user = await mpinModel.find({});
  const hashedMpin = CryptoJS.AES.decrypt(user[0].mpin, process.env.PASS_MPIN);

  const originalMpin = hashedMpin.toString(CryptoJS.enc.Utf8);

  const mpin = req.body.mpin;

  if (originalMpin != mpin) {
    res.json("failure");
  } else {
    res.status(200).json("success");
  }
};
exports.sendMpin = async (req, res) => {
  const user = await mpinModel
    .find({})
    .then(() => res.json(user))
    .catch((err) => res.json(err));
};

// exports.deleteCompany = async (req, res) => {
//   try {
//     await logInModel.deleteOne({ _id: req.params.id });
//     res.json({ message: "Company deleted successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// exports.getAllCompanies = async (req, res) => {
//   try {
//     const result = await logInModel.find({});
//     res.json(result);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.getDetailById = async (req, res) => {
  try {
    const id = req.params.id;
    const newPassword = req.body.confirmPassword;

    const result = await logInModel.findOne({ email: id });

    await result.updateOne({
      password: CryptoJS.AES.encrypt(
        newPassword,
        process.env.PASS_SEC
      ).toString(),
    });
    res.json("success");
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.checkEmail = async (req, res) => {
  const { forgotEmail } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "praveen0698@outlook.com",
      pass: "kpking900",
    },
  });

  let mailOptions = {
    from: "praveen0698@outlook.com",
    to: forgotEmail,
    subject: "Email Verification",
    text: `Your OTP to reset your password is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.send(otp);
    }
  });
};

exports.updateMpin = async (req, res) => {
  try {
    const result = await mpinModel.find({});

    await result[0].updateOne({
      mpin: CryptoJS.AES.encrypt(
        req.body.mpin,
        process.env.PASS_MPIN
      ).toString(),
    });
    res.json("success");
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
