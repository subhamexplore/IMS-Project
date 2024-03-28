import React, { useState, useEffect, useRef } from "react";
import shoes from "../../assets/shoes.png";
import clothes from "../../assets/clothes.png";
import jewellery from "../../assets/bag.png";
import { Bars } from "react-loader-spinner";
import SideBar from "../SideBar";
import NavBar from "../NavBar";
import Modal from "@mui/material/Modal";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { RxCrossCircled } from "react-icons/rx";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";
import Select from "react-select";
import { useReactToPrint } from "react-to-print";
import useScanDetection from "use-scan-detection";
import Box from "@mui/material/Box";

const Categories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [navClick, setNavClick] = useState(false);
  const [itemName, setItemName] = useState("");
  const [side, setSide] = useState(false);

  const navigation = useNavigate();

  const handleOpen = () => setOpen(true);

  const handleBarcodeClose = () => {
    setBarcodeOpen(false);
    setOpen(true);
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

  const [formData, setFormData] = useState({
    itemName: "",
    itemCode: "",
    itemDescription: "",
    sizes: "",
    salesPrice: 0,
    purchasePrice: 0,
    measuringUnit: "US",
    openingStock: 0,
    openingStockRate: 0,
    gstTax: 5,
    reorderPoint: 0,
    category: "shoes",
    scannedBarCode: [],
    batch: [
      {
        batchNumber: "",
        size: "",
        stockQty: "",
      },
    ],
  });

  const handleClose = () => {
    setFormData({
      itemName: "",
      itemCode: "",
      itemDescription: "",
      sizes: "",
      salesPrice: 0,
      purchasePrice: 0,
      measuringUnit: "US",
      openingStock: 0,
      openingStockRate: 0,
      gstTax: 5,
      reorderPoint: 0,
      category: "shoes",
      scannedBarCode: [],
      batch: [
        {
          batchNumber: "",
          size: "",
          stockQty: "",
        },
      ],
    });
    setQRCodeImage(null);
    setDisplayQR("none");
    setOpen(false);
  };

  const [scannedItems, setScannedItems] = useState([]);

  useScanDetection({
    onComplete: (barcode) => {
      setScannedItems((prevItems) => [...prevItems, barcode]);
    },
    minLength: 3,
  });

  const handleAddBarcode = () => {
    setFormData({
      ...formData,
      scannedBarCode: scannedItems,
    });

    handleBarcodeClose();
  };

  const Type = [
    {
      value: "US",
      label: "US",
    },
    {
      value: "UK",
      label: "UK",
    },
  ];
  const gstType = [
    {
      value: "5",
      label: "5%",
    },
    {
      value: "12",
      label: "12%",
    },
    {
      value: "18",
      label: "18%",
    },
    {
      value: "24",
      label: "24%",
    },
  ];

  const categoryItem = [
    {
      value: "shoes",
      label: "Shoes",
    },
    {
      value: "accessories",
      label: "Accessories",
    },
    {
      value: "clothing",
      label: "Clothing",
    },
  ];

  const [batch, setBatch] = useState([
    {
      id: Date.now(),
      batchNumber: "",
      size: "",
      stockQty: "",
    },
  ]);

  const addBatch = () => {
    const newBatch = {
      id: Date.now(),
      batchNumber: "",
      size: "",
      stockQty: "",
    };
    setBatch([...batch, newBatch]);
  };

  const removeBatch = (id) => {
    const updatedBatch = batch.filter((item) => item.id !== id);
    setBatch(updatedBatch);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      openingStock: totalStocks,
    });
  };

  const handleFileInputChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };
  const [totalStocks, setTotalStocks] = useState(0);
  const handleItemChange = (id, field, value) => {
    const updatedItems = batch.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setBatch(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: 400,
    bgcolor: "background.paper",
    border: "2px solid white",
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
  };

  const handleSave = async (e) => {
    try {
      const res = await axios.post(
        "http://localhost:3500/inventory",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const [updateId, setUpdateId] = useState(null);

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:3500/inventory/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const handleListChange = (index, e) => {
    const { name, value } = e.target;
    var updatedEntities = [];
    setFormData((prevData) => {
      updatedEntities = [...prevData.batch];
      updatedEntities[index] = {
        ...updatedEntities[index],
        [name]: value,
      };
      return {
        ...prevData,
        batch: updatedEntities,
      };
    });
  };

  useEffect(() => {
    const totalStocks = batch.reduce((total, item) => {
      return total + parseInt(item.stockQty || 0);
    }, 0);
    setTotalStocks(totalStocks);
  });

  useEffect(() => {
    setFormData({
      ...formData,
      itemName: itemName,
      openingStock: totalStocks,
    });
  }, []);

  const [qrCodeImage, setQRCodeImage] = useState(null);

  const generateQRCode = () => {
    setDisplayQR("block");
    setQRCodeImage(
      <QRCode
        value={JSON.stringify(formData)}
        style={{ width: "150px", height: "150px" }}
      />
    );
  };

  const [displayQR, setDisplayQR] = useState("none");

  const [updateForm, setUpdateForm] = useState(false);

  let componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  console.log(formData);

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
        <>
          {modalOpen ? (
            <div className="modal-ka-baap">
              <div className="add-item-modal-in" style={{ width: "45%" }}>
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">ADD STOCK BATCHES</div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setModalOpen(false);
                      setOpen(true);
                    }}
                  />
                </div>
                <hr />
                <div className="add-item-modal-mid">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>BATCH NUMBER</th>
                        <th>SIZE</th>
                        <th>STOCK QTY</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {batch.map((item, index) => (
                        <tr>
                          <td>
                            <input
                              type="text"
                              style={{
                                border: "none",
                                outline: "none",
                                width: "100%",
                              }}
                              name="batchNumber"
                              value={formData.batch[index]?.batchNumber}
                              onChange={(e) => {
                                handleItemChange(
                                  item.id,
                                  "batchNumber",
                                  e.target.value
                                );
                                handleListChange(index, e);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{
                                border: "none",
                                outline: "none",
                                width: "100%",
                              }}
                              name="size"
                              value={formData.batch[index]?.size}
                              onChange={(e) => {
                                handleItemChange(
                                  item.id,
                                  "size",
                                  e.target.value
                                );
                                handleListChange(index, e);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{
                                border: "none",
                                outline: "none",
                                width: "100%",
                              }}
                              name="stockQty"
                              value={formData.batch[index]?.stockQty}
                              onChange={(e) => {
                                handleItemChange(
                                  item.id,
                                  "stockQty",
                                  e.target.value
                                );
                                handleListChange(index, e);
                              }}
                            />
                          </td>
                          <td className="text-center">
                            <AiOutlineDelete
                              className="fw-bold"
                              style={{ color: "red" }}
                              onClick={() => removeBatch(batch.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    className="d-flex align-items-center table-below-add-btn"
                    style={{ gap: "5px" }}
                    onClick={() => addBatch()}
                  >
                    <IoAddCircleOutline />
                    <div>Add</div>
                  </button>
                </div>
                <div className="add-item-modal-bottom">
                  <div className="two-buttons-in">
                    <div className="mt-1" style={{ fontWeight: "700" }}>
                      {totalStocks ? `TOTAL: ${totalStocks}` : ""}
                    </div>
                    <button
                      className="next-button-in"
                      onClick={() => {
                        setModalOpen(false);
                        setOpen(true);
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <div className="layout-1" s>
            <SideBar navClick={navClick} side={side} />
            {/* start: body area */}
            <div className="wrapper">
              {/* start: page header */}
              <NavBar navClick={navClick} setNavClick={setNavClick} side={side} setSide={setSide} />
              {/* start: page toolbar */}
              <div className="main-div">
                <div className="item-list-div">
                  <div className="card-heading-item">
                    <h5>ALL ITEMS</h5>
                    <div
                      className="btn-div"
                      style={{ marginTop: "-3.5rem", marginRight: "10px" }}
                    >
                      <button id="btn-item3" onClick={handleOpen}>
                        Add to List
                      </button>
                    </div>
                  </div>
                  <div className="card-deck" style={{ gap: "30px" }}>
                    <div className="card" id="item">
                      <h5 id="item-h">SHOES</h5>

                      <div className="card-body">
                        <div className="img-div">
                          <img src={shoes} className="card-img" id="image" />
                        </div>
                      </div>
                      <div className="btn-div">
                        <button
                          id="btn-item"
                          onClick={() => navigation("/inventory/shoes")}
                        >
                          Go To List
                        </button>
                      </div>
                    </div>
                    <div className="card" id="item">
                      <h5 id="item-h">SHIRTS</h5>

                      <div className="card-body">
                        <div className="img-div">
                          <img src={clothes} className="card-img" id="image" />
                        </div>
                      </div>
                      <div className="btn-div">
                        <button
                          id="btn-item"
                          onClick={() => navigation("/inventory/clothing")}
                        >
                          Go To List
                        </button>
                      </div>
                    </div>
                    <div className="card" id="item">
                      <h5 id="item-h">ACCESSORIES</h5>

                      <div className="card-body">
                        <div className="img-div">
                          <img
                            src={jewellery}
                            className="card-img"
                            id="image"
                          />
                        </div>
                      </div>
                      <div className="btn-div">
                        <button
                          id="btn-item"
                          onClick={() => navigation("/inventory/accessories")}
                        >
                          Go To List
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Modal
                className="buyer-form-modal"
                open={barcodeOpen}
                onClose={handleBarcodeClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <div className="card-modal">
                    <h4>Scan Barcode</h4>
                    <RxCrossCircled
                      style={{
                        position: "absolute",
                        right: "20px",
                        top: "20px",
                        cursor: "pointer",
                      }}
                      onClick={handleBarcodeClose}
                    />

                    <ul style={{ height: "260px", overflowY: "scroll" }}>
                      {scannedItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>

                    <div
                      className="col-12 text-center mt-1"
                      onClick={handleAddBarcode}
                    >
                      <a className="btn btn-lg btn-block btn-dark lift text-uppercase">
                        Add Barcode
                      </a>
                    </div>
                  </div>
                </Box>
              </Modal>
              <Modal
                className="buyer-form-modal"
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <div className="buyer-form-container">
                  <form onSubmit={handleSubmit}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3>Add New Items</h3>
                      <Select
                        className="buyer-input"
                        margin="dense"
                        fullWidth
                        style={{ padding: "0" }}
                        name="itemSearch"
                        id="itemSearch"
                        value={{ label: itemName }}
                        onChange={(selectedOption) => {
                          console.log(selectedOption);
                          if (selectedOption) {
                            const { batch } = selectedOption.value;

                            setFormData({
                              ...formData,
                              itemName: selectedOption.value.itemName,
                              itemCode: selectedOption.value.itemCode,
                              itemDescription:
                                selectedOption.value.itemDescription,
                              salesPrice: selectedOption.value.salesPrice,
                              purchasePrice: selectedOption.value.purchasePrice,
                              batch: batch.map((batchItem) => ({
                                id: batchItem.id,
                                batchNumber: batchItem.batchNumber,
                                size: batchItem.size,
                                stockQty: batchItem.stockQty,
                              })),
                            });
                            setTotalStocks(totalStocks);
                            setItemName(selectedOption.value.itemName);
                            setUpdateForm(true);
                            setUpdateId(selectedOption.value._id);
                          }
                        }}
                        options={options}
                      />
                      <TextField
                        style={{
                          marginRight: "50px",
                          width: "150px",
                        }}
                        id="measuringUnit"
                        margin="dense"
                        className="buyer-input"
                        label="Categories"
                        type="text"
                        select
                        halfWidth
                        defaultValue="Select Company Type"
                        value={formData.category}
                        onChange={(e) => handleInputChange(e)}
                        name="category"
                        SelectProps={{
                          native: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      >
                        {categoryItem.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </div>
                    <RxCrossCircled
                      className="buyer-form-cross"
                      onClick={handleClose}
                    />

                    <div className="data-input-fields">
                      <div className="buyer-input-label">
                        <label>Item Name</label>
                        <TextField
                          className="buyer-input"
                          margin="dense"
                          type="text"
                          fullWidth
                          name="itemName"
                          id="itemName"
                          value={formData.itemName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              itemName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="buyer-input-label">
                        <label>Item Code</label>
                        <TextField
                          className="buyer-input"
                          margin="dense"
                          type="text"
                          fullWidth
                          name="itemCode"
                          id="itemCode"
                          value={formData.itemCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              itemCode: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="data-input-fields">
                      <div className="buyer-input-label">
                        <label>Item Description</label>
                        <TextField
                          className="buyer-input"
                          margin="dense"
                          type="text"
                          fullWidth
                          name="itemDescription"
                          id="itemDescription"
                          value={formData.itemDescription}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              itemDescription: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="buyer-input-label">
                        <label>GST</label>
                        <TextField
                          id="measuringUnit"
                          margin="dense"
                          className="buyer-input"
                          type="number"
                          select
                          fullWidth
                          defaultValue="Select GST"
                          value={formData.gstTax}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gstTax: e.target.value,
                            })
                          }
                          name="gstTax"
                          SelectProps={{
                            native: true,
                          }}
                        >
                          {gstType.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </TextField>
                      </div>
                      {/*  */}
                    </div>

                    <div className="data-input-fields">
                      <div className="buyer-input-label">
                        <label>Sales Price</label>
                        <TextField
                          className="buyer-input"
                          margin="dense"
                          type="number"
                          fullWidth
                          name="salesPrice"
                          id="salesPrice"
                          value={formData.salesPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              salesPrice: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="buyer-input-label">
                        <label>Purchase Price</label>
                        <TextField
                          className="buyer-input"
                          margin="dense"
                          type="number"
                          fullWidth
                          name="purchasePrice"
                          id="purchasePrice"
                          value={formData.purchasePrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              purchasePrice: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="data-input-fields">
                      <div className="buyer-input-label">
                        <label>Measuring Unit</label>
                        <TextField
                          id="measuringUnit"
                          margin="dense"
                          className="buyer-input"
                          type="text"
                          select
                          fullWidth
                          defaultValue="Select Company Type"
                          value={formData.measuringUnit}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              measuringUnit: e.target.value,
                            })
                          }
                          name="measuringUnit"
                          SelectProps={{
                            native: true,
                          }}
                        >
                          {Type.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </TextField>
                      </div>
                      <div
                        className="buyer-input-label"
                        style={{ position: "relative" }}
                      >
                        <label>Opening Stock</label>

                        <TextField
                          className="buyer-input"
                          margin="dense"
                          type="number"
                          fullWidth
                          name="openingStock"
                          id="openingStock"
                          value={totalStocks}
                          disabled
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              openingStock: totalStocks,
                            })
                          }
                          required
                        />
                        <button
                          style={{
                            position: "absolute",
                            right: "5px",
                            top: "45%",

                            background: "#00ac9a",
                            color: "white",
                            height: "25px",
                            width: "60px",
                            border: "none",
                            fontSize: "10px",
                            borderRadius: "5px",
                          }}
                          onClick={() => {
                            setModalOpen(true);
                            setOpen(false);
                          }}
                        >
                          BATCH
                        </button>
                      </div>
                    </div>

                    <div className="data-input-fields">
                      <div className="buyer-input-label">
                        <label>Opening Stock( Rate Per Unit)</label>
                        <TextField
                          className="buyer-input"
                          margin="dense"
                          type="number"
                          fullWidth
                          name="openingStockRate"
                          id="openingStockRate"
                          value={formData.openingStockRate}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              openingStockRate: e.target.value,
                            });
                            handleInputChange(e);
                          }}
                          required
                        />
                      </div>

                      <div className="buyer-input-label">
                        <label>Minimum Stock Point</label>
                        <TextField
                          className="buyer-input"
                          margin="dense"
                          type="number"
                          fullWidth
                          name="reorderPoint"
                          id="reorderPoint"
                          value={formData.reorderPoint}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              reorderPoint: e.target.value,
                            });
                            handleInputChange(e);
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div
                      className="data-input-fields"
                      style={{ justifyContent: "space-between" }}
                    >
                      <div className="image-input-fields">
                        <label>Upload Image</label>
                        <div className="drop-area">
                          <input
                            type="file"
                            // ref={fileInputRef}
                            // style={{ display: "none" }}
                            onChange={(e) => handleFileInputChange(e)}
                          />
                        </div>
                      </div>
                      <div style={{ display: "flex" }}>
                        <button
                          className={
                            qrCodeImage === null ? "qrBlock" : "qrNone"
                          }
                          onClick={generateQRCode}
                        >
                          Generate QR Code
                        </button>
                        <button
                          className="qrBlock"
                          style={{ marginLeft: "20px" }}
                          onClick={() => {
                            setBarcodeOpen(true);
                            setOpen(false);
                          }}
                        >
                          Scan Barcode
                        </button>

                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <Button
                            style={{ display: `${displayQR}` }}
                            onClick={handlePrint}
                          >
                            Print this out!
                          </Button>

                          {/* Your content */}
                          <div ref={(el) => (componentRef = el)}>
                            <p
                              style={{ textAlign: "center", marginTop: "10px" }}
                            >
                              {qrCodeImage}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="data-buttons">
                      <Button
                        id="input-btn-submit"
                        className="submit"
                        type="submit"
                        variant="outlined"
                        onClick={() => {
                          updateForm ? handleUpdate(updateId) : handleSave();
                          handleClose();
                          setOptions([]);
                        }}
                        //   disabled={buttonCheck?false:true}
                      >
                        {updateForm ? "Update" : "Submit"}
                      </Button>
                      <Button
                        id="input-btn-cancel"
                        className="cancel"
                        onClick={handleClose}
                        variant="outlined"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </Modal>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Categories;
