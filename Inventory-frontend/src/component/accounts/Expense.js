import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import NavBar from "../NavBar";
import { Link } from "react-router-dom";
import SideBar from "../SideBar";
import { AiOutlineDelete } from "react-icons/ai";
import Modal from "@mui/material/Modal";
import filter from "../../assets/Filters.png";
import Button from "@mui/material/Button";
import plus from "../../assets/Plus.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../AddedStyles.css";
import noDataImg from "../../assets/nodata.png";

const Expense = () => {
  const navigation = useNavigate();
  const [navClick, setNavClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [itemData, setItemData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [side, setSide] = useState(false);
  const [formData, setFormData] = useState({
    vendorName: "",
    expenseCategory: "",
    expenseNo: "",
    billDate: "",
    items: "",
    purchasePrice: "",
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

  const handleSearch = () => {
    const filteredData = itemData.filter((item) =>
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setItemData(filteredData);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => setOpen(true);

  const handleSave = async () => {
    await axios
      .post("http://localhost:3500/accounts/expense", formData)
      .then((result) => {
        handleClose();
        getItemData();
      })
      .catch((err) => console.log(err));
  };

  const [currentExpense, setcurrentExpense] = useState(1);
  const itemsDataperPage = 5;

  const indexOfLastItem = currentExpense * itemsDataperPage;
  const indexOffirstItem = indexOfLastItem - itemsDataperPage;
  const currentExpenseItem = itemData.slice(indexOffirstItem, indexOfLastItem);

  const totalPage = Math.ceil(itemData.length / itemsDataperPage);

  const nextPage = () => {
    setcurrentExpense(currentExpense + 1);
  };

  const prevPage = () => {
    setcurrentExpense(currentExpense - 1);
  };

  const cancelButton = () => {
    handleClose();
    setFormData({
      vendorName: "",
      expenseCategory: "",
      expenseNo: "",
      billDate: "",
      items: "",
    });
  };

  const deleteItem = async (id) => {
    await axios
      .delete(`http://localhost:3500/expense/delete/${id}`)
      .then(() => {
        getItemData();
      })
      .catch((err) => console.log(err));
  };

  const getItemData = async () => {
    await axios
      .get("http://localhost:3500/accounts/expense")
      .then((result) => setItemData(result.data))
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    getItemData();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      getItemData();
    }
  }, [searchQuery]);

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
        <div className="layout-1">
          <SideBar navClick={navClick} side={side} />
          <div className="wrapper">
            <NavBar navClick={navClick} setNavClick={setNavClick} side={side} setSide={setSide} />

            <div className="main-div-2">
              <div className="table" id="main-table">
                <div className="input-group-1 expense-e">
                  <div>
                    <p style={{ width: "220px" }}>Expense List </p>
                  </div>
                  <div
                    className="input-group "
                    style={{ justifyContent: "center" }}
                  >
                    <input
                      type="search"
                      className="rounded search-bar"
                      placeholder="Search by Vendor Name"
                      aria-label="Search"
                      aria-describedby="search-addon"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                    />

                    <button
                      type="button"
                      className="btn search-btn"
                      style={{
                        backgroundColor: "rgba(0, 172, 154, 1)",
                        color: "white",
                      }}
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                  </div>

                  <div className="filter-container">
                    <button id="btn-item" onClick={handleOpen}>
                      {" "}
                      Add
                      <img src={plus} />
                    </button>
                  </div>
                </div>
                {itemData.length > 0 ? (
                  <div className="table-wrapper">
                    {" "}
                    <table
                      className="table table-bordered "
                      style={{ height: "40vh" }}
                    >
                      <div id="table-responsive" className="table-responsive">
                        <table
                          id="table"
                          className="table table-hover table-striped text-nowrap table-vcenter mb-0"
                        >
                          <thead>
                            <tr>
                              <th>Sl No</th>
                              <th>VENDOR NAME</th>
                              <th>EXPENSE CATEGORY</th>
                              <th>ITEMS/NAME/PURCHASE</th>
                              <th>BILL DATE</th>
                              <th>PURCHASE PRICE</th>
                              <th>ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentExpenseItem.map((expense, index) => (
                              <tr key={index}>
                                <td>{index + indexOffirstItem + 1}</td>
                                <td>{expense.vendorName}</td>
                                <td>{expense.expenseCategory}</td>
                                <td>{expense.items}</td>
                                <td>{expense.billDate}</td>
                                <td>{expense.purchasePrice}</td>
                                <td>
                                  <div className="action-btn">
                                    <AiOutlineDelete
                                      style={{ color: "red" }}
                                      onClick={() => deleteItem(expense._id)}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </table>{" "}
                  </div>
                ) : (
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <img src={noDataImg} alt="no-data" />
                  </div>
                )}
              </div>
              <div>
                <button
                  className="buyer-page-btn"
                  onClick={prevPage}
                  disabled={currentExpense === 1}
                >
                  Previous
                </button>
                <button
                  className="buyer-page-btn"
                  onClick={nextPage}
                  disabled={currentExpense === totalPage || totalPage === 0}
                >
                  Next
                </button>
              </div>
              <div>
                Page {totalPage === 0 ? 0 : currentExpense} of
                {totalPage}
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        className="buyer-form-modal"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="buyer-form-container">
          <form className="form-input-fields">
            <h3>Add Record Expense</h3>
            <div className="mb-3 w-100">
              <label htmlFor="vendorName" className="form-label">
                Vendor Name
              </label>
              <input
                type="text"
                className="form-control"
                id="vendorName"
                name="vendorName"
                placeholder="Enter Name"
                value={formData.vendorName}
                onChange={handleInputChange}
              />
            </div>
            <div className="data-input-fields">
              <div class="mb-3 w-50">
                <label for="salesOrderNo" class="form-label">
                  Expense Category
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="expenseCategory"
                  name="expenseCategory"
                  placeholder="Enter Category"
                  value={formData.expenseCategory}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div class="mb-3 w-50">
                <label for="salesOrderDate" class="form-label">
                  Expense No
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="expenseNo"
                  name="expenseNo"
                  placeholder="SO-0001"
                  value={formData.expenseNo}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div class="mb-3 w-50">
                <label for="salesOrderDate" class="form-label">
                  Bill Date
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="billDate"
                  name="billDate"
                  placeholder="Select Date"
                  value={formData.billDate}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div class="mb-3 w-50">
                <label for="salesOrderDate" class="form-label">
                  Items/Name/Price
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="items"
                  name="items"
                  placeholder="Items/Name/Price"
                  value={formData.items}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div class="mb-3 w-50">
                <label for="salesOrderDate" class="form-label">
                  Purchase Price
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="purchasePrice"
                  name="purchasePrice"
                  placeholder="Purchase Price"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
            </div>

            <div className="data-buttons">
              <Button
                id="input-btn-submit"
                className="submit"
                type="button"
                variant="outlined"
                onClick={handleSave}
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
      </Modal>
    </div>
  );
};

export default Expense;
