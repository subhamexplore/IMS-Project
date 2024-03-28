import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import SideBar from "../SideBar";
import NavBar from "../NavBar";
import { HiOutlineFilter } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import noDataImg from "../../assets/nodata.png";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const [navClick, setNavClick] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [getShoesData, setGetShoesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [side, setSide] = useState(false);
  const navigation = useNavigate();

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

  const getInventory = async () => {
    const result = await axios.get("http://localhost:3500/inventory");
    const ShoesData = result.data.filter((item) => item.category === "shoes");
    if (ShoesData) {
      setIsLoading(false);
    }
    setGetShoesData(ShoesData);
  };

  const handleDelete = async (id) => {
    await axios
      .delete(`http://localhost:3500/inventory/delete/${id}`)
      .then(() => {
        alert("Deleted Successfully");
        getInventory();
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = () => {
    const filteredData = getShoesData.filter((item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setGetShoesData(filteredData);
  };

  useEffect(() => {
    getInventory();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      getInventory();
    }
  }, [searchQuery]);

  const [currentShoesPage, setcurrentShoesPage] = useState(1);
  const itemsPerShoesPage = 5;

  const indexOfLastShoesItem = currentShoesPage * itemsPerShoesPage;
  const indexOfFirstShoesItem = indexOfLastShoesItem - itemsPerShoesPage;
  const currentShoesItems = getShoesData.slice(
    indexOfFirstShoesItem,
    indexOfLastShoesItem
  );

  const totalShoesPages = Math.ceil(getShoesData.length / itemsPerShoesPage);

  const nextShoesPage = () => {
    setcurrentShoesPage(currentShoesPage + 1);
  };

  const prevShoesPage = () => {
    setcurrentShoesPage(currentShoesPage - 1);
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
            <div
              style={{
                fontSize: "1.4rem",
                width: "500px",
                display: "flex",
              }}
            >
              <div style={{ padding: "20px 40px 0" }}>
                <span style={{ color: "#00AC9A", fontWeight: "600" }}>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigation("/dashboard")}
                  >
                    Home
                  </span>
                  /
                  <span
                    onClick={() => navigation("/inventory/categories")}
                    style={{ color: "black", cursor: "pointer" }}
                  >
                    categories
                  </span>
                </span>
              </div>
            </div>

            <div className="main-div-2">
              <div className="table" id="main-table">
                <div className="input-group-1 search-p">
                  <p>Shoes List</p>
                  <div className="input-group ">
                    <input
                      type="search"
                      className="rounded search-bar"
                      placeholder="Search by Item Name"
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
                {getShoesData.length > 0 ? (
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
                              <th>ITEMS NAME</th>
                              <th>ITEM CODE</th>
                              <th>OPENING STOCK</th>
                              <th>STATUS</th>
                              <th>SELLING PRICE</th>
                              <th>PURCHASE PRICE</th>
                              <th>ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentShoesItems.map((item, index) => (
                              <tr key={index} style={{ cursor: "pointer" }}>
                                <td>{index + indexOfFirstShoesItem + 1}</td>
                                <td>{item.itemName}</td>

                                <td>{item.itemCode}</td>
                                <td>{item.openingStock} PCS</td>
                                <td>
                                  <button
                                    className={
                                      item.reorderPoint > 15
                                        ? "button-status-green"
                                        : "button-status-red"
                                    }
                                    style={{
                                      width: "80px",
                                    }}
                                  >
                                    {item.reorderPoint > 15
                                      ? "In Stock"
                                      : "Low Stock"}
                                  </button>
                                </td>
                                <td>₹ {item.salesPrice}</td>
                                <td>₹ {item.purchasePrice}</td>
                                <div className="action-btn">
                                  <td onClick={() => handleDelete(item._id)}>
                                    <AiOutlineDelete style={{ color: "red" }} />
                                  </td>
                                </div>
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
                  onClick={prevShoesPage}
                  disabled={currentShoesPage === 1}
                >
                  Previous
                </button>
                <button
                  className="buyer-page-btn"
                  onClick={nextShoesPage}
                  disabled={
                    currentShoesPage === totalShoesPages ||
                    totalShoesPages === 0
                  }
                >
                  Next
                </button>
              </div>
              <div>
                Page {totalShoesPages === 0 ? 0 : currentShoesPage} of{" "}
                {totalShoesPages}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
