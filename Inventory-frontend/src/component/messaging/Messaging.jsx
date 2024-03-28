import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Messaging = () => {
  const navigation = useNavigate();
  const [navClick, setNavClick] = useState(false);
  const [side, setSide] = useState(false);
  useEffect(() => {
    const crossCheck = localStorage.getItem("cross");
    const expiryCheck = localStorage.getItem("expiryDate");
    if (!crossCheck) {
      if (expiryCheck) {
        navigation("/mpin");
      } else {
        navigation("/");
      }
    }
  }, []);
  const [customerNumber, setCustomerNumber] = useState("");
  const [isSent, setIsSent] = useState(false);

  const sendBillViaSMS = async () => {
    try {
      const response = await axios.post("http://localhost:3500/sendBill", {
        customerNumber,
      });
      if (response.status === 200) {
        setIsSent(true);
      }
    } catch (error) {
      console.error("Error sending bill link:", error);
    }
  };

  return (
    <div>
      <h1>Send apparel Bill via SMS</h1>
      <label>
        Customer Phone Number:
        <input
          type="text"
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)}
        />
      </label>
      <br />
      <button onClick={sendBillViaSMS}>Send Bill via SMS</button>
      {isSent && <p>Bill link sent successfully!</p>}
    </div>
  );
};

export default Messaging;
