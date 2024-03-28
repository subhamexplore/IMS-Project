import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import SideBar from "../SideBar";
import NavBar from "../NavBar";
import { HiOutlineFilter } from "react-icons/hi";
import noDataImg from "../../assets/nodata.png";
import { AiOutlineDelete } from "react-icons/ai";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const SalesTable = () => {
  const navigation = useNavigate();
  const [navClick, setNavClick] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [getSalesData, setGetSalesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const getSales = async () => {
    const result = await axios.get("http://localhost:3500/sales");
    setIsLoading(false);
    setGetSalesData(result.data);
  };

  const deleteSales = async (id) => {
    await axios
      .delete(`http://localhost:3500/sales/delete/${id}`)
      .then(() => {
        getSales();
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = () => {
    const filteredData = getSalesData.filter((item) =>
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setGetSalesData(filteredData);
  };

  useEffect(() => {
    getSales();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      getSales();
    }
  }, [searchQuery]);

  const [currentSalesPage, setcurrentSalesPage] = useState(1);
  const itemsPerSalesPage = 8;

  const indexOfLastSalesItem = currentSalesPage * itemsPerSalesPage;
  const indexOfFirstSalesItem = indexOfLastSalesItem - itemsPerSalesPage;
  const currentSalesItems = getSalesData.slice(
    indexOfFirstSalesItem,
    indexOfLastSalesItem
  );

  const totalSalesPages = Math.ceil(getSalesData.length / itemsPerSalesPage);

  const nextSalesPage = () => {
    setcurrentSalesPage(currentSalesPage + 1);
  };

  const prevSalesPage = () => {
    setcurrentSalesPage(currentSalesPage - 1);
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
                <div className="input-group-1 search-p">
                  <p>Sales List</p>
                  <div className="input-group ">
                    <input
                      type="search"
                      className="rounded search-bar"
                      placeholder="Search by Customer"
                      aria-describedby="search-addon"
                      value={searchQuery}
                      onChange={(e) => {
                        console.log("Input Value:", e.target.value);
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
                {getSalesData.length > 0 ? (
                  <div className="table-wrapper">
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
                              <th>CUSTOMER</th>
                              <th>MOBILE</th>
                              <th>PAYMENT</th>
                              <th>DISCOUNT</th>
                              <th>TAX</th>
                              <th>AMOUNT</th>
                              <th>ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentSalesItems.map((item, index) => (
                              <tr key={index} style={{ cursor: "pointer" }}>
                                <td>{index + indexOfFirstSalesItem + 1}</td>
                                <td>{item.customerName}</td>
                                <td>{item.mobile}</td>
                                <td>{item.method}</td>
                                <td>₹ {item.totalDiscount}</td>
                                <td>₹ {item.totalGST}</td>
                                <td>₹ {item.totalAmount}</td>
                                <td>
                                  {" "}
                                  <div className="action-btn">
                                    <AiOutlineDelete
                                      style={{ color: "red" }}
                                      onClick={() => deleteSales(item._id)}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </table>
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
                  onClick={prevSalesPage}
                  disabled={currentSalesPage === 1}
                >
                  Previous
                </button>
                <button
                  className="buyer-page-btn"
                  onClick={nextSalesPage}
                  disabled={
                    currentSalesPage === totalSalesPages ||
                    totalSalesPages === 0
                  }
                >
                  Next
                </button>
              </div>
              <div>
                Page {totalSalesPages === 0 ? 0 : currentSalesPage} of{" "}
                {totalSalesPages}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTable;
