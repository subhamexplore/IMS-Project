import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import NavBar from "../NavBar";
import { Bars } from "react-loader-spinner";
import { Link } from "react-router-dom";
import "../../Styles.css";
import {
  Button,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
// import SalesViewTable from "./SalesViewTable";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { QrReader } from "react-qr-reader";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import axios from "axios";
import Select from "react-select";

const SalesForm = () => {
  const [navClick, setNavClick] = useState(false);
  const [side, setSide] = useState(false);
  const [product, setProduct] = useState();
  const qrReader = React.createRef();
  const [formData, setFormData] = useState({
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
    totalDiscount: 0,
    totalGST: 0,
    totalAmount: 0,
  });
  const [item, setItem] = useState([]);
  const [ID, setID] = useState("");
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
  };

  const handleItemChange = (e, id) => {
    const updateData = item.map((elem) => {
      return elem.id === id
        ? { ...elem, [e.target.name]: e.target.value, ["amount"]: elem.price }
        : elem;
    });
    setItem(updateData);
  };
  const [totalGST, setTotalGST] = useState(0);
  const [totalAmt, setTotalAmt] = useState(0);
  const [totalDisc, setTotalDisc] = useState(0);
  useEffect(() => {
    const calcTotalAmount = item.reduce((total, elem) => {
      return total + parseInt(elem.amount || 0);
    }, 0);
    const calcTotalDiscount = item.reduce((total, elem) => {
      return total + parseInt(elem.discount || 0);
    }, 0);
    const calcTotalSGST = item.reduce((total, elem) => {
      return total + parseInt(elem.sgst || 0);
    }, 0);
    const calcTotalCGST = item.reduce((total, elem) => {
      return total + parseInt(elem.cgst || 0);
    }, 0);
    setTotalGST(calcTotalSGST + calcTotalCGST);
    setTotalAmt(calcTotalAmount);
    setTotalDisc(calcTotalDiscount);
  });

  const handleSelectChange = (e) => {
    let data;
    const selectData = options.map((elem) => {
      if (elem.value._id === e.value._id) {
        data = elem;
      }
    });
    setProduct(data);
  };

  const [options, setOptions] = useState([]);
  const [itemName, setItemName] = useState("");
  const [size, setSize] = useState([]);

  const [data, setData] = useState("No result");

  const dataObject =
    data === "No result"
      ? {}
      : JSON.parse(
          '{"' +
            data
              .replace(/"/g, '\\"')
              .replace(/:/g, '":"')
              .replace(/,/g, '","')
              .replace(/}/g, '"}')
              .replace(/{/g, '{"') +
            '"}'
        );
  console.log("dataaa", dataObject);
  const [salesData, setSalesData] = useState({
    customerName: "",
    mobile: "",
    salesOrderNo: "",
    salesOrderDate: "",
    formData: [
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
    totalAmount: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [barCodeOpen, setBarCodeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const [productItems, setProductItems] = useState([
    // Sample data, replace it with your actual product items
    { itemName: "Product 1", hsn: "HSN001", sellingPrice: "₹ 100" },
    { itemName: "Product 2", hsn: "HSN002", sellingPrice: "₹ 150" },
    // ... (more items)
  ]);

  const deleteRow = (id) => {
    const updatedData = item.filter((elem) => {
      return elem.id !== id;
    });
    setItem(updatedData);
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...formData];
    updatedData[index][field] = value;
    setFormData(updatedData);
  };

  const [totalAmount, setTotalAmount] = useState(0);
  const handleListChange = (index, e) => {
    const { name, value } = e.target;
    setSalesData((prevData) => {
      const updatedEntities = [...prevData.formData];
      updatedEntities[index] = {
        ...updatedEntities[index],
        [name]: value,
        amount: calculateTotalAmount(index),
      };

      return {
        ...prevData,
        formData: updatedEntities,
      };
    });
  };

  // useEffect(() => { const total = salesData.formData.reduce((acc, row) => acc + Number(row.amount), 0);
  //   setTotalAmount(total);})
  const handleSaleInput = (e) => {
    setSalesData({
      ...salesData,
      [e.target.name]: e.target.value,
      totalAmount: totalAmount,
    });
  };

  const calculateTotalAmount = (index) => {
    const total =
      salesData.formData[index]?.price -
      salesData.formData[index]?.price *
        (salesData.formData[index]?.discount / 100);
    const afterTax =
      total +
      ((total * salesData.formData[index]?.cgst) / 100 +
        (total * salesData.formData[index]?.sgst) / 100);

    return afterTax.toFixed(2);
  };

  const [indexValue, setIndexValue] = useState(0);

  useEffect(() => {
    const data = item.map((elem) => {
      return elem.id === ID
        ? {
            ...elem,
            itemName: product ? product.value.itemName : "",
            hsnCode: product ? product.value.itemCode : "",
            price: product ? product.value.salesPrice : "",
          }
        : elem;
    });
    setItem(data);
  }, [product]);

  useEffect(() => {
    const data = item.map((elem) => {
      let qty = parseInt(elem.quantity) || 0;
      let discount = parseInt(elem.discount) || 0;
      let sgst = parseInt(elem.sgst) || 0;
      let cgst = parseInt(elem.cgst) || 0;
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

  const handleSave = () => {
    setFormData({
      ...formData,
      items: item,
      totalGST: totalGST,
      totalDiscount: totalDisc,
      totalAmount: totalAmt,
    });
  };

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
      sgst: 0,
      cgst: 0,
    };
    setItem([...item, newItem]);
    setID(newItem.id);
  };

  console.log("dataaaaaaaa", dataObject);

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
          {modalOpen ? (
            <div className="modal-ka-baap">
              <div className="add-item-modal-in">
                <div className="add-item-modal-top d-flex align-items-center">
                  <div className="fw-bold fs-5">ADD ITEMS</div>
                  <div
                    className="inputs d-flex align-items-center mx-3"
                    style={{ paddingLeft: "70px" }}
                  >
                    <input
                      className="search-input-in"
                      type="text"
                      placeholder="Enter your search keyword"
                      style={{ width: "250px" }}
                    />
                    <button className="search-button-in">Search</button>
                  </div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => setModalOpen(false)}
                  />
                </div>
                <hr />
                <div className="add-item-modal-mid">
                  <table className="table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>ITEMS NAME</th>
                        <th>HSN CODE</th>
                        <th>SELLING PRICE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productItems.map((item) => (
                        <tr>
                          <td>
                            <input type="checkbox" />
                          </td>
                          <td>{item.itemName}</td>
                          <td>{item.hsn}</td>
                          <td>{item.sellingPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="add-item-modal-bottom">
                  <div className="two-buttons-in">
                    <button className="next-button-in">Next</button>
                    <button
                      className="cancel-button-in"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
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

                        if (!!error) {
                          console.info(error);
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
                      onClick={() => setBarCodeOpen(false)}
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
              <div
                className="above-table"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "200px" }}>
                  <div
                    style={{
                      fontSize: "1.4rem",
                      width: "500px",
                      display: "flex",
                    }}
                  >
                    <div style={{ padding: "40px" }}>
                      <span style={{ color: "#00AC9A", fontWeight: "bold" }}>
                        <Link
                          to="/dashboard"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          Home{" "}
                        </Link>{" "}
                        / Sales /
                      </span>
                      <span style={{ color: "black" }}> Sales Order</span>
                    </div>
                  </div>

                  <div className="page-toolbar px-xl-3 px-sm-2 px-0 py-3">
                    <div className="overlay" style={{ background: "white" }}>
                      <div style={{ padding: "20px 40px" }}>
                        <span style={{ color: "black", fontSize: "20px" }}>
                          New Sales Order
                        </span>
                      </div>
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
                              value={salesData.customerName}
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
                              value={salesData.mobile}
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
                              value={salesData.salesOrderNo}
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
                              value={salesData.salesOrderDate}
                              onChange={(e) => handleSaleInput(e)}
                            />
                          </div>
                        </div>
                      </form>
                      <div
                        className="search-p expense-e"
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
                            name="itemName"
                            id="salesItem"
                            value={{ label: itemName }}
                            onChange={(selectedOption) => {
                              handleSelectChange(selectedOption);
                              console.log(selectedOption);
                              if (selectedOption) {
                                var updatedEntities = [];
                                setSalesData((prevData) => {
                                  updatedEntities = [...prevData.formData];
                                  updatedEntities[indexValue] = {
                                    ...updatedEntities[indexValue],
                                    itemName: selectedOption.value.itemName,
                                    hsnCode: selectedOption.value.itemCode,
                                    price: selectedOption.value.salesPrice,
                                    sgst: selectedOption.value.gstTax / 2,
                                    cgst: selectedOption.value.gstTax / 2,
                                  };
                                  // console.log(updatedEntities)
                                  return {
                                    ...prevData,
                                    formData: updatedEntities,
                                  };
                                });

                                setItemName(selectedOption.value.itemName);
                                setSize(selectedOption.value.batch);
                              }
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
                          onClick={() => {
                            setBarCodeOpen(true);
                            setData("No result");
                          }}
                        >
                          <div>
                            <QrCodeScannerIcon />{" "}
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
                                <th>Size</th>
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
                                      onChange={(e) =>
                                        handleItemChange(e, row.id)
                                      }
                                      // value={salesData.formData[index]?.itemName}
                                      // onChange={(e) => {
                                      //   handleInputChange(
                                      //     index,
                                      //     "itemName",
                                      //     e.target.value
                                      //   );
                                      //   handleListChange(index, e);
                                      // }}
                                    />
                                  </td>
                                  <td>
                                    <TextField
                                      name="hsnCode"
                                      type="text"
                                      value={row.hsnCode}
                                      onChange={(e) =>
                                        handleItemChange(e, row.id)
                                      }
                                      // value={salesData.formData[index]?.hsnCode}
                                      // onChange={(e) => {
                                      //   handleInputChange(
                                      //     index,
                                      //     "hsnCode",
                                      //     e.target.value
                                      //   );
                                      //   handleListChange(index, e);
                                      // }}
                                    />
                                  </td>
                                  <td>
                                    <TextField
                                      style={{ width: "80px", marginTop: "0" }}
                                      id="measuringUnit"
                                      margin="dense"
                                      className="buyer-input"
                                      type="number"
                                      select
                                      fullWidth
                                      defaultValue="size"
                                      value={row.size}
                                      onChange={(e) =>
                                        handleItemChange(e, row.id)
                                      }
                                      // value={salesData.formData[index]?.size}
                                      // onChange={(e) => {
                                      //   {
                                      //     handleInputChange(
                                      //       index,
                                      //       "size",
                                      //       e.target.value
                                      //     );
                                      //     handleListChange(index, e);
                                      //     setIndexValue(index);
                                      //   }
                                      // }}
                                      name="size"
                                      SelectProps={{
                                        native: true,
                                      }}
                                    >
                                      {size.map((option) => (
                                        <option
                                          key={option.size}
                                          value={option.size}
                                        >
                                          {option.size}
                                        </option>
                                      ))}
                                    </TextField>
                                  </td>
                                  <td>
                                    <TextField
                                      type="number"
                                      name="quantity"
                                      value={row.quantity}
                                      onChange={(e) =>
                                        handleItemChange(e, row.id)
                                      }
                                      // value={salesData.formData[index]?.quantity}
                                      // onChange={(e) => {
                                      //   handleInputChange(
                                      //     index,
                                      //     "quantity",
                                      //     e.target.value
                                      //   );
                                      //   handleListChange(index, e);
                                      //   setIndexValue(index);
                                      // }}
                                    />
                                  </td>

                                  <td>
                                    <TextField
                                      type="number"
                                      name="price"
                                      value={row.price}
                                      onChange={(e) =>
                                        handleItemChange(e, row.id)
                                      }
                                      // value={salesData.formData[index]?.price}
                                      // onChange={(e) => {
                                      //   handleInputChange(
                                      //     index,
                                      //     "price",
                                      //     e.target.value
                                      //   );
                                      //   handleListChange(index, e);
                                      // }}
                                    />
                                  </td>
                                  <td>
                                    <TextField
                                      type="number"
                                      // value={salesData.formData[index]?.discount}
                                      name="discount"
                                      value={row.discount}
                                      onChange={(e) =>
                                        handleItemChange(e, row.id)
                                      }
                                      // onChange={(e) => {
                                      //   handleInputChange(
                                      //     index,
                                      //     "discount",
                                      //     e.target.value
                                      //   );
                                      //   handleListChange(index, e);
                                      //   setIndexValue(index);
                                      // }}
                                    />
                                  </td>
                                  <td>
                                    <TextField
                                      type="number"
                                      name="sgst"
                                      value={row.sgst}
                                      onChange={(e) =>
                                        handleItemChange(e, row.id)
                                      }
                                      // value={salesData.formData[index]?.sgst}
                                      // onChange={(e) => {
                                      //   handleInputChange(
                                      //     index,
                                      //     "sgst",
                                      //     e.target.value
                                      //   );
                                      //   handleListChange(index, e);
                                      // }}
                                    />
                                  </td>
                                  <td>
                                    <TextField
                                      type="number"
                                      name="cgst"
                                      value={row.cgst}
                                      onChange={(e) =>
                                        handleItemChange(e, row.id)
                                      }
                                      // value={salesData.formData[index]?.cgst}
                                      // onChange={(e) => {
                                      //   handleInputChange(
                                      //     index,
                                      //     "cgst",
                                      //     e.target.value
                                      //   );
                                      //   handleListChange(index, e);
                                      // }}
                                    />
                                  </td>
                                  <td>
                                    <TextField
                                      type="number"
                                      // value={calculateTotalAmount(index)}
                                      value={row.amount}
                                      onChange={(e) =>
                                        handleItemChange(e, row.id)
                                      }
                                      name="amount"
                                      // onChange={(e) => {
                                      //   handleInputChange(
                                      //     index,
                                      //     "amount",
                                      //     e.target.value
                                      //   );
                                      //   handleListChange(index, e);
                                      // }}
                                    />
                                  </td>
                                  <td>
                                    <IconButton
                                      onClick={() => deleteRow(row.id)}
                                    >
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
                              2. All the disputes are subject to Delhi
                              jurisdiction only
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesForm;
