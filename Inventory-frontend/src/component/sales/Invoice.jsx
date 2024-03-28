import React, { useRef, useState, useEffect } from "react";
import "../../Invoice.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Bars } from "react-loader-spinner";
import axios from "axios";

const Invoice = () => {
  const { state } = useLocation();
  const [navClick, setNavClick] = useState(false);
  const [side, setSide] = useState(false);

  const navigation = useNavigate();

  const mobileNo = state.formData.mobile;
  const id = state.formData.uniqueId;

  let componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: (styles) => ({
      ...styles,
      "thead th": {
        ...styles["thead th"],
        border: "1px solid black",
        textAlign: "left",
      },
    }),
  });

  const sendBillViaSMS = async () => {
    try {
      const response = await axios.post("http://localhost:3500/sendBill", {
        mobileNo,
        id,
      });
      // if (response.status === 200) {
      //   setIsSent(true);
      // }
      console.log(response);
    } catch (error) {
      console.error("Error sending bill link:", error);
    }
  };

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

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      {isLoading ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <Bars
            height="80"
            width="80"
            color="#40a1ed"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <div className="invoice-container">
          <div className="head-t">
            <div className="tax-i">
              <button className="invoice-btn" onClick={() => handlePrint()}>
                Print
              </button>
              <button className="invoice-btn" onClick={sendBillViaSMS}>
                Send
              </button>
              <button
                className="invoice-btn"
                onClick={() => navigation("/sales/sales-order")}
              >
                Back
              </button>
            </div>
          </div>
          <div className="invoice" ref={componentRef}>
            <div className="head-i">
              <div className="logo-a">
                <h4>Insta-e-Mart</h4>
                <div className="logo-a">
                  <p>
                    WA -89 Mother Diary Road Near ICICI Bank, PIN No:-110092
                    Phone no.: 9873101193 Email:
                    narayanenterprises.textile@gmail.com GSTIN: 07CMSPA8242G1ZW,
                    State: 07-Delhi
                  </p>
                </div>
              </div>
            </div>
            <div className="main-table">
              <table className="table">
                <thead className="table-c">
                  <tr className="color">
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      Bill To
                    </th>
                    {/* <th>Ship To</th> */}
                  </tr>
                </thead>
                <tbody>
                  <tr className="">
                    <td className="inst">
                      <h5 style={{ textTransform: "uppercase" }}>
                        {state.formData.customerName}
                      </h5>

                      <p>Phone: {state.formData.mobile}</p>
                    </td>
                    {/* <td className="wa-p">
                  <p>WA-89 BLOCK NEW PATPARGANJ,ROAD SHAKARPUR,DELHI 110092</p>
                </td> */}
                    <td className="wa-pl">
                      <p>Sales Order Number:{state.formData.salesOrderNo}</p>
                      <p>Sales Order Date : {state.formData.salesOrderDate} </p>
                      <p>TIme : 02:53 PM </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="table">
                <thead className="table-c">
                  <tr className="color">
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      S.N
                    </th>
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      ITEM
                    </th>
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      HSN/SAC
                    </th>
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      QTY
                    </th>
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      PRICE
                    </th>
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      DISCOUNT
                    </th>
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      GST
                    </th>
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      AMOUNT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.formData.items.map((item, index) => (
                    <tr key={item.id} className="item-t table-cl">
                      <td>{index + 1}</td>
                      <td>{item.itemName}</td>
                      <td>{item.hsnCode}</td>
                      <td>{item.quantity}</td>
                      <td>₹ {item.price}</td>
                      <td>₹ {item.discount}</td>
                      <td>{item.cgst + item.sgst}%</td>
                      <td>₹ {item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="main-table">
              <table className="table">
                <thead className="table-c">
                  <tr className="color">
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      Before Tax Amount
                    </th>
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      CGST
                    </th>
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      SGST
                    </th>
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      Total Discount
                    </th>
                    <th
                      style={{ backgroundColor: "rgb(137, 95, 252)" }}
                      colSpan={2}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tdata">
                    <td>
                      ₹{" "}
                      {state.formData.totalDiscount +
                        (state.formData.totalAmount - state.formData.totalGST)}
                    </td>
                    <td>₹ {state.formData.totalGST / 2}</td>
                    <td>₹ {state.formData.totalGST / 2}</td>

                    <td>₹ {state.formData.totalDiscount}</td>
                    <td className="total-l">Sub Total</td>
                    <td className="total-l">₹ {state.formData.totalAmount}</td>
                  </tr>

                  <tr className="tdata">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="total-l">Grand Total</td>
                    <td className="total-l">₹ {state.formData.totalAmount}</td>
                  </tr>
                </tbody>
              </table>

              <table className="table" style={{ marginBottom: "0" }}>
                <thead className="table-c">
                  <tr className="color wid-t">
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      Payment Mode
                    </th>
                    <th style={{ backgroundColor: "rgb(137, 95, 252)" }}>
                      Authorized Signatory
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tdata">
                    <td
                      style={{
                        height: "100px",
                        textAlign: "left",
                        display: "flex",
                        flexDirection: "column",
                        gap: "30px",
                      }}
                    >
                      <span style={{ textTransform: "uppercase" }}>
                        {state.formData.method}
                      </span>
                      <span style={{ fontWeight: "700" }}>
                        Thank you for shopping with us!!
                      </span>
                    </td>
                    <td
                      style={{ width: "200px", height: "100px" }}
                      className="textr"
                    ></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
