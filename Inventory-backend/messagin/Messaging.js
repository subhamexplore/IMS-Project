const twilio = require("twilio");

const accountSid = "ACb4a0d2e749fedc45d0e6b331839be716";
const authToken = "65ce83acc187c938179293dd34931f2b";
const client = twilio(accountSid, authToken);

exports.messageCreate = async (req, res) => {
  const { mobileNo, id } = req.body;
  console.log();
  const billLink = `http://localhost:3000/bills/${id}`; // Construct bill link

  client.messages
    .create({
      body: `Thanks for shopping!!
             Here is your bill: ${billLink}`,
      from: "+17868411057",
      to: `+91${mobileNo}`,
    })
    .then(() => {
      res.status(200).send("Bill link sent successfully!");
    })
    .catch((err) => {
      console.error("Error sending SMS:", err);
      res.status(500).send("Failed to send bill link");
    });
};
