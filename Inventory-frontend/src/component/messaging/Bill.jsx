import React, { useRef, useState, useEffect } from "react";
import "../../Bill.css";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Bars } from "react-loader-spinner";
import { jsPDF } from "jspdf";
import axios from "axios";

const Bill = () => {
  const [navClick, setNavClick] = useState(false);
  const { id } = useParams();
  const [side, setSide] = useState(false);

  const navigation = useNavigate();

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

  const [billData, setBillData] = useState();

  const getBill = async () => {
    await axios
      .get(`http://localhost:3500/bill-generated/${id}`)
      .then((res) => setBillData(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getBill();
  }, []);

  const handleDownloadPdf = () => {
    const pdf = new jsPDF();

    // Initialize y-coordinate for positioning text
    let y = 20;

    // Write the title
    pdf.text("Bill", 20, y);
    y += 10; // Increment y-coordinate for the next line

    // Iterate over each product in the billData
    billData.product.forEach((item, index) => {
      const text = `
        Item: ${index + 1},
        Qty: ${item.quantity},
        Price: ₹ ${item.price},
        Total: ₹ ${item.amount},
        CGST: ₹ ${(item.cgst / 100) * item.price},
        SGST: ₹ ${(item.sgst / 100) * item.price}
      `;

      // Write the text at the current y-coordinate
      pdf.text(text, 20, y);
      y += 10; // Increment y-coordinate for the next line
    });

    // Write the total GST, discount, total amount, and payment mode
    const totalText = `
      Total GST: ₹ ${billData.totalGST},
      Discount: ₹ ${billData.totalDiscount},
      Total: ₹ ${billData.totalAmount},
      Payment Mode: ${billData.method}
    `;

    // Write the text at the current y-coordinate
    pdf.text(totalText, 20, y);
    y += 10; // Increment y-coordinate for the next line

    // Save the PDF
    pdf.save("Bill.pdf");
  };

  console.log(billData);

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
            </div>
          </div>
          <div className="invoice" ref={componentRef}>
            <div className="bill-app ">
              <div className="logo-a">
                <h3>Insta-e-Mart</h3>
                <div className="logo-a">
                  <p>
                    WA -89 Mother Diary Road Near ICICI Bank, PIN No:-110092
                    Phone no.: 9873101193 Email:
                    narayanenterprises.textile@gmail.com GSTIN: 07CMSPA8242G1ZW,
                    State: 07-Delhi
                  </p>
                </div>
              </div>

              <div className="item-1 fs-4">
                <label>Customer Name: {billData.customerName}</label>
                <label>Date: {billData.salesOrderDate}</label>
                <label>Invoice Number: {billData.salesOrderNo}</label>
              </div>
              <hr />
              <table className="table-table-r fs-4">
                <thead>
                  <tr>
                    <th style={{ width: "50px" }}>SN</th>
                    <th>ITEM</th>
                    <th>QTY</th>
                    <th>PRICE</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>

                <tbody>
                  {billData.product.map((item, index) => (
                    <>
                      <hr />
                      <tr>
                        <td style={{ width: "50px" }}>{index + 1}</td>
                        <td>{item.itemName}</td>
                        <td>{item.quantity}</td>
                        <td>
                          ₹ {item.price} <br></br>CGST: ₹{" "}
                          {(item.cgst / 100) *
                            (item.quantity * item.price - item.discount)}
                        </td>
                        <td>
                          ₹ {item.amount} <br></br>SGST: ₹{" "}
                          {(item.sgst / 100) *
                            (item.quantity * item.price - item.discount)}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>

              <hr />
              <table className="item-1">
                <th style={{ paddingLeft: "10px", fontWeight: "900" }}>
                  Total GST: ₹ {billData.totalGST}
                </th>
              </table>
              <hr />

              <div className="item-1">
                <label style={{ paddingLeft: "10px", fontWeight: "700" }}>
                  Discount: ₹ {billData.totalDiscount}
                </label>

                <hr />

                <label style={{ paddingLeft: "10px", fontWeight: "700" }}>
                  Total: ₹ {billData.totalAmount}
                </label>
                <label style={{ paddingLeft: "10px", fontWeight: "700" }}>
                  {" "}
                  Payment Mode: {billData.method}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bill;
