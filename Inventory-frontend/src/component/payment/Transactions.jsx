import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import SideBar from "../SideBar";
import NavBar from "../NavBar";
import { HiOutlineFilter } from "react-icons/hi";
import noDataImg from "../../assets/nodata.png";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const navigation = useNavigate();
  const [side, setSide] = useState(false);
  const [navClick, setNavClick] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [getTransactionData, setGetTransactionData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const getTransaction = async () => {
    const result = await axios.get(
      "http://localhost:3500/payment/transactions"
    );
    if (result) {
      setIsLoading(false);
    }
    setGetTransactionData(result.data.items);
  };

  const handleSearch = () => {
    const filteredData = getTransactionData.filter((item) =>
      item.order_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setGetTransactionData(filteredData);
  };

  useEffect(() => {
    getTransaction();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      getTransaction();
    }
  }, [searchQuery]);

  const [currentTransactionPage, setcurrentTransactionPage] = useState(1);
  const itemsPerTransactionPage = 8;

  const indexOfLastTransactionItem =
    currentTransactionPage * itemsPerTransactionPage;
  const indexOfFirstTransactionItem =
    indexOfLastTransactionItem - itemsPerTransactionPage;
  const currentTransactionItems = getTransactionData.slice(
    indexOfFirstTransactionItem,
    indexOfLastTransactionItem
  );

  const totalTransactionPages = Math.ceil(
    getTransactionData.length / itemsPerTransactionPage
  );

  const nextTransactionPage = () => {
    setcurrentTransactionPage(currentTransactionPage + 1);
  };

  const prevTransactionPage = () => {
    setcurrentTransactionPage(currentTransactionPage - 1);
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
        <div className="layout-1">
          <SideBar navClick={navClick} side={side} />
          {/* start: body area */}
          <div className="wrapper">
            {/* start: page header */}
            <NavBar navClick={navClick} setNavClick={setNavClick} side={side} setSide={setSide} />
            {/* start: page toolbar */}

            <div className="main-div-2">
              <div className="table" id="main-table">
                <div className="input-group-1 expense-e">
                  <p>Transaction List</p>
                  <div className="input-group ">
                    <input
                      type="search"
                      className="rounded search-bar"
                      placeholder="Search by Order Id"
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
                </div>
                {getTransactionData.length > 0 ? (
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
                              <th>ORDER ID</th>
                              <th>METHOD</th>
                              <th>CONTACT</th>
                              <th>AMOUNT</th>
                              <th>FEE</th>
                              <th>TAX</th>
                              <th>STATUS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentTransactionItems.map((item, index) => (
                              <tr key={index} style={{ cursor: "pointer" }}>
                                <td>
                                  {index + indexOfFirstTransactionItem + 1}
                                </td>
                                <td>{item.order_id}</td>
                                <td>{item.method}</td>
                                <td>{item.contact}</td>
                                <td>₹ {item.amount / 100}</td>
                                <td>₹ {item.fee / 100}</td>
                                <td>₹ {item.tax / 100}</td>

                                <td
                                  id={
                                    item.status === "captured"
                                      ? "status-green"
                                      : "status-red"
                                  }
                                >
                                  {item.status}
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
                  onClick={prevTransactionPage}
                  disabled={currentTransactionPage === 1}
                >
                  Previous
                </button>
                <button
                  className="buyer-page-btn"
                  onClick={nextTransactionPage}
                  disabled={
                    currentTransactionPage === totalTransactionPages ||
                    totalTransactionPages === 0
                  }
                >
                  Next
                </button>
              </div>
              <div>
                Page {totalTransactionPages === 0 ? 0 : currentTransactionPage}
                of {totalTransactionPages}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
