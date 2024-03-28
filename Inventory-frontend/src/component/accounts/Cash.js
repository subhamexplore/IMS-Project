import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import NavBar from "../NavBar";
import SideBar from "../SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import noDataImg from "../../assets/nodata.png";

const Cash = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [side, setSide] = useState(false);
  const [itemData, setItemData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [getSalesData, setGetSalesData] = useState([]);
  const [navClick, setNavClick] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const [currentSalesPage, setcurrentSalesPage] = useState(1);
  const itemsPerSalesPage = 8;

  const handleSearch = () => {
    // Filtering itemData
    const filteredItemData = itemData.filter((item) =>
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setItemData(filteredItemData);

    // Filtering getSalesData
    const filteredSalesData = getSalesData.filter((item) =>
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setGetSalesData(filteredSalesData);
  };

  const calculateTotalAmount = () => {
    const totalSalesAmount = getSalesData.reduce(
      (total, salesItem) => total + parseFloat(salesItem.totalAmount || 0),
      0
    );

    const totalExpenseAmount = itemData.reduce(
      (total, expenseItem) =>
        total + parseFloat(expenseItem.purchasePrice || 0),
      0
    );

    return totalSalesAmount - totalExpenseAmount;
  };

  const mergedData = [...getSalesData, ...itemData];

  const totalAmount = calculateTotalAmount();
  const totalColor = totalAmount >= 0 ? "green" : "red";
  const totalSign = totalAmount >= 0 ? "+" : "-";

  const indexOfLastSalesItem = currentSalesPage * itemsPerSalesPage;
  const indexOfFirstSalesItem = indexOfLastSalesItem - itemsPerSalesPage;
  const currentSalesItems = mergedData.slice(
    indexOfFirstSalesItem,
    indexOfLastSalesItem
  );

  const totalSalesPages = Math.ceil(mergedData.length / itemsPerSalesPage);

  const nextSalesPage = () => {
    setcurrentSalesPage(currentSalesPage + 1);
  };

  const prevSalesPage = () => {
    setcurrentSalesPage(currentSalesPage - 1);
  };

  const getItemData = async () => {
    await axios
      .get("http://localhost:3500/accounts/expense")
      .then((result) => setItemData(result.data))
      .catch((err) => console.log(err));
  };

  const getSales = async () => {
    const result = await axios.get("http://localhost:3500/sales");
    setGetSalesData(result.data);
  };

  useEffect(() => {
    getItemData();
    getSales();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      getItemData();
      getSales();
    }
  }, [searchQuery]);

  const [dataObject, setDataObject] = useState(null);
  const [item, setItem] = useState([]);
  const [ID, setID] = useState("");

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

  const itemNames = getSalesData.flatMap((obj) =>
    obj.product.map((product) => product.itemName)
  );

  const itemNamesString = itemNames.join(", ");

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
                    <p style={{ width: "220px" }}>Cash On Hand </p>
                  </div>

                  <div
                    className="input-group "
                    style={{ justifyContent: "center" }}
                  >
                    <input
                      type="search"
                      className="rounded search-bar"
                      placeholder="Search by Name"
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
                    <p style={{ color: totalColor }}>
                      {Math.abs(totalAmount) > 0 ? "Profit:" : "Loss:"}{" "}
                      {totalSign} ₹ {Math.abs(totalAmount)}
                    </p>
                  </div>
                </div>
                {getSalesData.length > 0 || itemData.length > 0 ? (
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
                              <th>NAME</th>
                              <th>TYPE</th>
                              <th>ITEMS PURCHASED</th>
                              <th>DATE</th>
                              <th>AMOUNT</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentSalesItems.map((item, index) => (
                              <tr key={index}>
                                <td>{index + indexOfFirstSalesItem + 1}</td>
                                <td>{item.customerName || item.vendorName}</td>
                                <td>{item.expenseCategory || item.method}</td>
                                <td>{item.items || itemNamesString}</td>
                                <td>{item.billDate || item.salesOrderDate}</td>
                                <td>
                                  {item.purchasePrice ? (
                                    <span style={{ color: "red" }}>
                                      - ₹ {item.purchasePrice}
                                    </span>
                                  ) : "" || item.totalAmount ? (
                                    <span style={{ color: "green" }}>
                                      + ₹ {item.totalAmount}
                                    </span>
                                  ) : (
                                    ""
                                  )}
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
                Page {totalSalesPages === 0 ? 0 : currentSalesPage} of
                {totalSalesPages}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cash;
