import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import NavBar from "../NavBar";
import { Bars } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles.css";
import { Button, TextField, IconButton } from "@mui/material";
// import SalesViewTable from "./SalesViewTable";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { QrReader } from "react-qr-reader";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import axios from "axios";
import Select from "react-select";
import BarcodeReader from "react-barcode-reader";
import { v4 as uuidv4 } from "uuid";

const SalesForm = () => {
  const [dataScan, setDataScan] = React.useState("");
  const [side, setSide] = useState(false);
  const [navClick, setNavClick] = useState(false);
  const uniqueId = uuidv4();

  const navigation = useNavigate();
  const qrReader = React.createRef();
  const [product, setProduct] = useState();
  const [data, setData] = useState("");
  const [dataObject, setDataObject] = useState(null);
  const [item, setItem] = useState([]);
  const [ID, setID] = useState("");
  const [totalGST, setTotalGST] = useState(0);
  const [totalAmt, setTotalAmt] = useState(0);
  const [totalDisc, setTotalDisc] = useState(0);
  const [options, setOptions] = useState([]);
  const [itemName, setItemName] = useState("");
  const [barCodeOpen, setBarCodeOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scannedData, setScannedData] = useState("");

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

  const [formData, setFormData] = useState({
    customerName: "",
    mobile: "",
    salesOrderNo: "",
    salesOrderDate: "",
    uniqueId: uniqueId,
    items: [
      {
        id: "",
        itemName: "",
        hsnCode: "",
        quantity: 0,
        price: 0,
        discount: 0,
        size: 0,
        amount: 0,
        sgst: 0,
        cgst: 0,
      },
    ],
    method: "cash",
    totalDiscount: 0,
    totalGST: 0,
    totalAmount: 0,
  });

  const addItem = () => {
    const newItem = {
      id: new Date().getTime().toString(),
      itemName: "",
      hsnCode: "",
      quantity: 0,
      price: 0,
      discount: 0,
      size: 0,
      amount: 0,
      sgst: 0,
      cgst: 0,
    };
    setItem([...item, newItem]);
    setID(newItem.id);
    setData("");
    setItemName("");
    setProduct();
    setDataObject(null);
    setScannedData("");
  };

  const handleItemChange = (e, id) => {
    const updateData = item.map((elem) => {
      return elem.id === id
        ? { ...elem, [e.target.name]: e.target.value, ["amount"]: elem.price }
        : elem;
    });
    setItem(updateData);
  };

  useEffect(() => {
    const calcTotalAmount = item.reduce((total, elem) => {
      return total + parseInt(elem.amount || 0);
    }, 0);
    const calcTotalDiscount = item.reduce((total, elem) => {
      return total + parseInt(elem.discount || 0);
    }, 0);
    const calcTotalSGST = item.reduce((total, elem) => {
      let price = parseInt(elem.price) || 0;
      let qty = parseInt(elem.quantity) || 0;
      let discount = parseInt(elem.discount) || 0;
      return total + (price * qty - discount) * (parseInt(elem.sgst) / 100);
    }, 0);
    const calcTotalCGST = item.reduce((total, elem) => {
      let price = parseInt(elem.price) || 0;
      let qty = parseInt(elem.quantity) || 0;
      let discount = parseInt(elem.discount) || 0;
      return total + (price * qty - discount) * (parseInt(elem.cgst) / 100);
    }, 0);
    setTotalGST(calcTotalSGST + calcTotalCGST);
    setTotalAmt(calcTotalAmount);
    setTotalDisc(calcTotalDiscount);
  });

  const handleSelectChange = (dataSelect) => {
    setProduct(dataSelect);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3500/inventory");
        const formattedOptions = response.data.map((item) => ({
          value: item,
          label: item.itemName,
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const deleteRow = (id) => {
    const updatedData = item.filter((elem) => {
      return elem.id !== id;
    });
    setItem(updatedData);
  };

  const handleSaleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getUnique = async () => {
    if (dataScan) {
      await axios
        .get(`http://localhost:3500/find-item/${dataScan}`)
        .then((res) => setScannedData(res.data))
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    getUnique();
  }, [dataScan]);

  useEffect(() => {
    const data = item.map((elem) => {
      return elem.id === ID
        ? {
            ...elem,
            itemName: dataObject ? dataObject.itemName : "",
            hsnCode: dataObject ? dataObject.itemCode : "",
            price: dataObject ? dataObject.salesPrice : "",
            cgst: dataObject ? dataObject.gstTax / 2 : "",
            sgst: dataObject ? dataObject.gstTax / 2 : "",
          }
        : elem;
    });
    setItem(data);
  }, [dataObject]);

  useEffect(() => {
    const data = item.map((elem) => {
      return elem.id === ID
        ? {
            ...elem,
            itemName: scannedData ? scannedData.itemName : "",
            hsnCode: scannedData ? scannedData.itemCode : "",
            price: scannedData ? scannedData.salesPrice : "",
            cgst: scannedData ? scannedData.gstTax / 2 : "",
            sgst: scannedData ? scannedData.gstTax / 2 : "",
          }
        : elem;
    });
    setItem(data);
  }, [scannedData]);

  useEffect(() => {
    const data = item.map((elem) => {
      return elem.id === ID
        ? {
            ...elem,
            itemName: product ? product.value.itemName : "",
            hsnCode: product ? product.value.itemCode : "",
            price: product ? product.value.salesPrice : "",
            cgst: product ? product.value.gstTax / 2 : "",
            sgst: product ? product.value.gstTax / 2 : "",
          }
        : elem;
    });
    setItem(data);
  }, [product]);

  useEffect(() => {
    const data = item.map((elem) => {
      let price = parseInt(elem.price) || 0;
      let qty = parseInt(elem.quantity) || 0;
      let discount = parseInt(elem.discount) || 0;
      let sgst = (price * qty - discount) * (parseInt(elem.sgst) / 100) || 0;
      let cgst = (price * qty - discount) * (parseInt(elem.cgst) / 100) || 0;
      let calculatedAmount = elem.price * qty + sgst + cgst - discount;
      if (calculatedAmount !== elem.amount) {
        return {
          ...elem,
          amount: calculatedAmount,
        };
      }
      return elem;
    });
    if (JSON.stringify(data) !== JSON.stringify(item)) {
      setItem(data);
    }
  }, [item]);

  const handleSave = async () => {
    setFormData({
      ...formData,
      items: item,
      totalGST: totalGST,
      totalDiscount: totalDisc,
      totalAmount: totalAmt,
    });

    setPaymentOpen(true);
  };

  const paymentHandler = async (e) => {
    setIsLoading(true);
    const amount = formData.totalAmount * 100;
    const currency = "INR";

    try {
      const response = await fetch("http://localhost:3500/order", {
        method: "POST",
        body: JSON.stringify({
          amount,
          currency,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();
      if (order) {
        setIsLoading(false);
      }

      const options = {
        key: "",
        amount,
        currency,
        name: "Insta-e-Mart",
        order_id: order.id,
        handler: function (response) {
          setPaymentOpen(false);
          navigation("/sales/invoice", { state: { formData } });
        },
        prefill: {
          name: formData.customerName,
          contact: formData.contact,
          invoice_id: formData.salesOrderNo,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
      });

      rzp1.open();
    } catch (error) {
      console.error("Payment error:", error.message);
    }

    e.preventDefault();
  };

  useEffect(() => {
    if (data !== "") {
      const jsonObject = JSON.parse(data);
      setDataObject(jsonObject);
      setBarCodeOpen(false);
      setData("");
    }
  }, [data]);

  const handleNext = () => {
    setBarCodeOpen(false);
    const newItem = {
      id: new Date().getTime().toString(),
      itemName: dataObject.itemName,
      hsnCode: dataObject.itemCode,
      quantity: 0,
      price: dataObject.salesPrice,
      discount: 0,
      size: 0,
      amount: 0,
      sgst: dataObject.sgst / 2,
      cgst: dataObject.cgst / 2,
    };
    setItem([...item, newItem]);
    setID(newItem.id);
  };

  const methodPayment = [
    {
      label: "Select Payment",
    },
    {
      label: "Cash",
      value: "cash",
    },
    {
      label: "Online",
      value: "online",
    },
  ];

  const closeCam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    window.location.reload();
  };

  const handleScan = (data) => {
    setDataScan(data);
  };

  const handleError = (err) => {
    console.error(err);
  };

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
        <div>
          {barCodeOpen ? (
            <div className="modal-ka-baap">
              <div className="add-item-modal-in" style={{ width: "500px" }}>
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">Scan QR</div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => setBarCodeOpen(true)}
                  />
                </div>
                <hr />
                <div className="add-item-modal-mid">
                  <div>
                    <QrReader
                      onResult={(result, error) => {
                        if (!!result) {
                          setData(result?.text);
                          qrReader.current.stop();
                        }
                      }}
                      style={{ width: "100%", height: "50%" }}
                    />
                    <p>{data}</p>
                  </div>
                </div>
                <div className="add-item-modal-bottom">
                  <div className="two-buttons-in">
                    <button className="next-button-in" onClick={handleNext}>
                      Next
                    </button>
                    <button
                      className="cancel-button-in"
                      onClick={() => {
                        setBarCodeOpen(false);
                        closeCam();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {paymentOpen ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{ width: "400px", height: "150px", textAlign: "center" }}
              >
                <h3>Confirm Your Payment</h3>
                <div className="add-item-modal-bottom" style={{ right: "50%" }}>
                  <div className="payment-pop-buttons">
                    <button
                      className="next-button-in"
                      style={{
                        padding: "10px 30px",
                        height: "40px",
                        width: "120px",
                        cursor: "pointer",
                      }}
                      onClick={async (e) => {
                        formData.method === "cash"
                          ? navigation("/sales/invoice", {
                              state: { formData },
                            })
                          : paymentHandler(e);
                        await axios.post(
                          "http://localhost:3500/sales",
                          formData
                        );
                      }}
                    >
                      Pay
                    </button>
                    <button
                      className="cancel-button-in"
                      onClick={() => setPaymentOpen(false)}
                      style={{
                        padding: "10px 30px",
                        height: "40px",
                        width: "120px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="layout-1" s>
            <SideBar navClick={navClick} side={side} />
            <div className="wrapper">
              <NavBar navClick={navClick} setNavClick={setNavClick} side={side} setSide={setSide} />
              <div className="overlay" style={{ background: "white" }}>
                <div style={{ padding: "20px 40px" }}>
                  <span style={{ color: "black", fontSize: "20px" }}>
                    New Sales Order
                  </span>
                </div>

                <BarcodeReader onError={handleError} onScan={handleScan} />

                <form className="form-input-fields">
                  <div className="data-input-fields">
                    <div class="mb-3 w-50">
                      <label for="customerName" class="form-label">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        name="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleSaleInput(e)}
                      />
                    </div>
                    <div class="mb-3 w-50">
                      <label for="mobileNumber" class="form-label">
                        Mobile Number
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        id="exampleInputPassword1"
                        name="mobile"
                        value={formData.mobile}
                        onChange={(e) => handleSaleInput(e)}
                      />
                    </div>
                  </div>
                  <div className="data-input-fields">
                    <div class="mb-3 w-50">
                      <label for="salesOrderNo" class="form-label">
                        Sales Order No.
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        name="salesOrderNo"
                        value={formData.salesOrderNo}
                        onChange={(e) => handleSaleInput(e)}
                      />
                    </div>
                    <div class="mb-3 w-50">
                      <label for="salesOrderDate" class="form-label">
                        Sales Order Date
                      </label>
                      <input
                        type="date"
                        class="form-control"
                        id="exampleInputPassword1"
                        name="salesOrderDate"
                        value={formData.salesOrderDate}
                        onChange={(e) => handleSaleInput(e)}
                      />
                    </div>
                  </div>
                </form>
                <div
                  className="search-p"
                  style={{
                    justifyContent: "space-between",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 30px",
                    gap: "100px",
                  }}
                >
                  <div>
                    <lable>Search the Product</lable>
                    <Select
                      margin="dense"
                      fullWidth
                      isDisabled={item.length > 0 ? false : true}
                      name="itemName"
                      id="salesItem"
                      value={{ label: itemName }}
                      onChange={(selectedOption) => {
                        handleSelectChange(selectedOption);
                        setItemName(selectedOption.value.itemName);
                      }}
                      options={options}
                    />
                  </div>

                  <button
                    style={{
                      height: "50px",
                      display: "flex",
                      width: "200px",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #565A5C",
                      fontSize: "20px",
                      color: " #565A5C",
                      gap: "5px",
                    }}
                    onClick={() => setBarCodeOpen(true)}
                  >
                    <div>
                      <QrCodeScannerIcon />
                    </div>
                    <div>Qr Code</div>
                  </button>
                </div>
                <div
                  className="salesviewtable"
                  style={{
                    marginTop: "50px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                  }}
                >
                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>NO</th>
                          <th>ITEM NAME</th>
                          <th>Hsn Code</th>
                          <th>QTY</th>
                          <th>PRICE/ITEM</th>
                          <th>DISCOUNT(%)</th>
                          <th>SGST</th>
                          <th>CGST</th>
                          <th>AMOUNT</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.map((row, index) => (
                          <tr key={row.id}>
                            <td>{index + 1}</td>
                            <td>
                              <TextField
                                type="text"
                                value={row.itemName}
                                name="itemName"
                                onChange={(e) => handleItemChange(e, row.id)}
                              />
                            </td>
                            <td>
                              <TextField
                                name="hsnCode"
                                type="text"
                                value={row.hsnCode}
                                onChange={(e) => handleItemChange(e, row.id)}
                              />
                            </td>

                            <td>
                              <TextField
                                type="number"
                                name="quantity"
                                value={row.quantity}
                                onChange={(e) => handleItemChange(e, row.id)}
                              />
                            </td>

                            <td>
                              <TextField
                                type="number"
                                name="price"
                                value={row.price}
                                onChange={(e) => handleItemChange(e, row.id)}
                              />
                            </td>
                            <td>
                              <TextField
                                type="number"
                                name="discount"
                                value={row.discount}
                                onChange={(e) => handleItemChange(e, row.id)}
                              />
                            </td>
                            <td>
                              <TextField
                                type="number"
                                name="sgst"
                                value={row.sgst}
                                onChange={(e) => handleItemChange(e, row.id)}
                              />
                            </td>
                            <td>
                              <TextField
                                type="number"
                                name="cgst"
                                value={row.cgst}
                                onChange={(e) => handleItemChange(e, row.id)}
                              />
                            </td>
                            <td>
                              <TextField
                                type="number"
                                value={row.amount}
                                onChange={(e) => handleItemChange(e, row.id)}
                                name="amount"
                              />
                            </td>
                            <td>
                              <IconButton onClick={() => deleteRow(row.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button
                    style={{
                      height: "40px",
                      display: "flex",
                      left: "10rem",
                      width: "150px",
                      alignItems: "right",
                      justifyContent: "center",
                      border: "2px solid #565A5C",
                      fontSize: "15px",
                      color: " #565A5C",
                    }}
                    variant="outlined"
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    onClick={addItem}
                  >
                    Add
                  </Button>
                </div>

                <div className="other-sales-content">
                  <div className="other-sales-content-left">
                    <div>Terms And Condition</div>
                    <div className="sales-content-box">
                      <div>
                        1. Goods once Sold will be not taken back or be
                        exchanged.
                      </div>
                      <div>
                        2. All the disputes are subject to Delhi jurisdiction
                        only
                      </div>
                    </div>
                  </div>
                  <div
                    className="other-sales-content-left"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <TextField
                      id="measuringUnit"
                      margin="dense"
                      className="buyer-input"
                      type="text"
                      select
                      fullWidth
                      defaultValue="method"
                      value={formData.method}
                      onChange={(e) => handleSaleInput(e)}
                      name="method"
                      SelectProps={{
                        native: true,
                      }}
                    >
                      {methodPayment.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          disabled={
                            option.label === "Select Payment" ? true : false
                          }
                        >
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                    <div>Discount : Rs {totalDisc}</div>
                    <div>GST Amount : Rs {totalGST}</div>
                    <div>SUBTOTAL : Rs {totalAmt}</div>
                    <div className="sales-content-btn">
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#00AC9A",
                          height: "40px",
                          width: "100px",
                        }}
                        onClick={handleSave}
                      >
                        SAVE
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#FFD8D8",
                          height: "40px",
                          width: "100px",
                          color: "#FF1616",
                        }}
                      >
                        CANCEL
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesForm;
