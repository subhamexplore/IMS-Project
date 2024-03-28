import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { RxCrossCircled } from "react-icons/rx";
import axios from "axios";
import Form from "react-bootstrap/Form";

const CreateCompany = () => {
  const navigation = useNavigate();
  const [error, setError] = useState("#D5D4D2");
  const [navClick, setNavClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const [formData, setFormData] = useState({
    gstin: " ",
    companyName: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    pincode: "",
    mobileNumber: "",
    email: "",
    registrationType: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    await axios
      .post("http://localhost:3500/buyers-suppliers", formData)
      .then((result) =>
        result.data === "success" ? navigation("/dashboard") : setError("red")
      )
      .catch((err) => console.log(err));
  };

  const cancelButton = () => {
    handleClose();
    setFormData({
      gstin: " ",
      companyName: "",
      address1: "",
      address2: "",
      country: "",
      state: "",
      pincode: "",
      mobileNumber: "",
      email: "",
      resgitrationType: "",
    });
  };

  const handleSubmit = (e) => {
    console.log("Form submitted:", formData);
  };
  return (
    <div>
      <div
        className="buyer-form-container"
        style={{ position: "relative", marginTop: "80px" }}
      >
        <div className="page-head">
          <h3 style={{ marginTop: "28px" }}>Create Company</h3>
          <div className="data-buttons-2">
            <Button
              id="input-btn-gst"
              className="submit"
              type="submit"
              variant="outlined"
              onClick={handleSave}
            >
              <Form.Check type="radio" aria-label="radio 1" />
              With gst
            </Button>

            <Button
              id="input-btn-gst2"
              className="submit"
              type="submit"
              variant="outlined"
              onClick={handleSave}
            >
              <Form.Check type="radio" aria-label="radio 1" />
              Non- gst
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="buyer-input-labels">
            <label>GSTIN</label>
            <TextField
              className="buyer-input"
              margin="dense"
              type="text"
              fullWidth
              name="gstin"
              id="gstin"
              placeholder="24XXXXXXXXXXXXXX"
              value={formData.gstin}
              onChange={(e) => handleInputChange(e)}
              required
            />
            <span>Enter your 15 digit GSTIN number</span>
          </div>
          <div className="mt-4">
            <h5>GSTIN Legal Information</h5>
          </div>

          <div className="data-input-fields">
            <div className="buyer-input-label">
              <label>Company Name</label>
              <TextField
                className="buyer-input"
                margin="dense"
                type="text"
                fullWidth
                name="companyName"
                id="companyName"
                placeholder="Enter Name"
                value={formData.companyName}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>

            <div className="buyer-input-label">
              <label>Mobile Number</label>
              <TextField
                className="buyer-input"
                margin="dense"
                type="number"
                fullWidth
                placeholder="Enter Mobile Number"
                name="payAmount"
                id="payAmount"
                value={formData.payAmount}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>
          </div>

          <div className="data-input-fields">
            <div className="buyer-input-label">
              <label>Address Line1</label>
              <TextField
                className="buyer-input"
                margin="dense"
                type="text"
                fullWidth
                placeholder="Eg. 29XXXXXX9834XIXX"
                name="address1"
                id="address1"
                value={formData.address1}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>

            <div className="buyer-input-label">
              <label>Address Line2</label>
              <TextField
                className="buyer-input"
                margin="dense"
                type="text"
                fullWidth
                placeholder="Eg. 29XXXXXX9834XIXX"
                name="address2"
                id="address2"
                value={formData.address2}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>
          </div>

          <div className="data-input-fields">
            <div className="buyer-input-label">
              <label>Country</label>
              <TextField
                className="buyer-input"
                margin="dense"
                type="text"
                fullWidth
                name="country"
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>
            <div className="buyer-input-label">
              <label>Pincode</label>
              <TextField
                className="buyer-input"
                margin="dense"
                type="number"
                fullWidth
                placeholder="751024"
                name="pincode"
                id="pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>
          </div>

          <div className="data-input-fields">
            <div className="buyer-input-label">
              <label>State</label>
              <TextField
                className="buyer-input"
                margin="dense"
                type="text"
                fullWidth
                name="state"
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>

            <div className="buyer-input-label">
              <label>Email</label>
              <TextField
                className="buyer-input"
                margin="dense"
                type="email"
                fullWidth
                placeholder="Enter Your Email"
                name="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>
          </div>
          <div className="data-input-fields">
            <div className="buyer-input-label">
              <label>Mobile Number</label>
              <TextField
                className="buyer-input"
                margin="dense"
                type="number"
                fullWidth
                placeholder="1234789"
                name="mobileNumber"
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>

            <div className="buyer-input-label">
              <label>Resgitration Type</label>
              <TextField
                className="buyer-input"
                margin="dense"
                type="text"
                fullWidth
                placeholder="Regular (With GST)"
                name="registrationtype"
                id="registrationtype"
                value={formData.registrationtype}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>
          </div>
          <div className="data-buttons">
            <Button
              id="input-btn-submit"
              className="submit"
              type="submit"
              variant="outlined"
              onClick={handleSave}

              //   disabled={buttonCheck?false:true}
            >
              Submit
            </Button>
            <Button
              id="input-btn-cancel"
              className="cancel"
              onClick={cancelButton}
              variant="outlined"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompany;
