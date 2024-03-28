import React, { useEffect, useState } from "react";

import SideBar from "../SideBar";
import NavBar from "../NavBar";
import "../../Styles.css";
import ApexCharts from "react-apexcharts";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const Skeleton = () => (
  <div className="skeleton" style={{ height: "100%", width: "100%" }} />
);

const Dashboard = () => {
  const navigation = useNavigate();
  const [navClick, setNavClick] = useState(false);
  const [side, setSide] = useState(false);
  const [getSalesData, setGetSalesData] = useState([]);
  const [stockValue, setStockValue] = useState("");
  const [chartData, setChartData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

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
  const indexOfLastSalesItem = currentSalesPage * itemsPerSalesPage;
  const indexOfFirstSalesItem = indexOfLastSalesItem - itemsPerSalesPage;
  const currentSalesItems = getSalesData.slice(
    indexOfFirstSalesItem,
    indexOfLastSalesItem
  );

  const [totalStock, setTotalStock] = useState([]);

  const getStock = async () => {
    const result = await axios.get("http://localhost:3500/inventory");
    const QuantityData = result.data.filter((item) => item.openingStock > 0);

    setTotalStock(QuantityData);

    const ShoesData = result.data.filter(
      (item) => item.category === "shoes"
    ).length;
    const ClothingData = result.data.filter(
      (item) => item.category === "clothing"
    ).length;
    const AccessoriesData = result.data.filter(
      (item) => item.category === "accessories"
    ).length;
    const Data = result.data.length;
    setStockValue(Data);
    setChartData([ShoesData, ClothingData, AccessoriesData]);
  };

  const stock = totalStock.map((obj) => obj.openingStock);

  const sumOfStocks = stock.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getStock();
        setIsLoading(false);
        setIsDashboardLoading(false);
      } catch (error) {
        console.error("Error fetching stock:", error);
        setIsLoading(false);
        setIsDashboardLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const salesChart = new ApexCharts(
      document.querySelector("#saleschart"),
      salesChartOptions
    );
    salesChart.render();
  }, []);

  const getItemData = async () => {
    const result = await axios.get("http://localhost:3500/accounts/expense");
    const expenseData = result.data.filter((item) => item.purchasePrice > 0);
    setItemData(expenseData);
  };

  const expense = itemData.map((obj) => obj.purchasePrice);

  const sumOfExpenses = expense.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const [soldQuantity, setSoldQuantity] = useState([]);

  const getSales = async () => {
    const result = await axios.get("http://localhost:3500/sales");
    const soldData = result.data.filter((item) => item.totalAmount > 0);

    setSoldQuantity(soldData);
    setGetSalesData(result.data);
  };

  const stockSold = soldQuantity.map((obj) => obj.totalAmount);

  const sumOfStocksSold = stockSold.reduce(
    (accumulator, currentValue) =>
      parseFloat(accumulator) + parseFloat(currentValue),
    0
  );

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

  const totalAmount = calculateTotalAmount();
  const totalColor = totalAmount >= 0 ? "green" : "red";
  const totalSign = totalAmount >= 0 ? "+" : "-";

  const [getPayAmt, setGetPayAmt] = useState([]);
  const [getCollectAmt, setGetCollectAmt] = useState([]);
  const getBuyersSuppliers = async () => {
    const result = await axios.get("http://localhost:3500/buyers-suppliers");
    const payData = result.data.filter((item) => item.payAmount > 0);
    setGetPayAmt(payData);
    const collectData = result.data.filter((item) => item.collectAmount > 0);
    setGetCollectAmt(collectData);
  };

  const payValues = getPayAmt.map((obj) => obj.payAmount);
  const collectValues = getCollectAmt.map((obj) => obj.collectAmount);

  const sumOfPay = payValues.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const sumOfCollect = collectValues.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const chartOptions = {
    series: chartData,
    labels: ["Shoes", "Clothing", "Accessories"],
    chart: {
      width: 380,
      type: "donut",
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    colors: ["#9399A1", "#10CBB7", "#2794EB"], // Set desired colors here
  };

  const chartPayableOptions = {
    series: [sumOfPay, sumOfCollect],
    labels: ["To Pay", "To Collect"],
    chart: {
      width: 380,
      type: "donut",
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    colors: ["#9399A1", "#10CBB7"],
  };

  const salesChartOptions = {
    series: [
      {
        name: "Revenue",
        type: "column",
        data: [11.54, 5.87],
      },
      {
        name: "Cost",
        type: "column",
        data: [5.87],
      },
      {
        name: "Revenue",
        type: "line",
        data: [11.54],
      },
    ],
    chart: {
      height: 350,
      type: "line",
      stacked: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [1, 1, 4],
    },
    title: {
      text: "Sales Statistics",
      align: "left",
      offsetX: 110,
    },
    xaxis: {
      categories: ["Revenue", "Cost"],
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: "#008FFB",
        },
        labels: {
          style: {
            colors: "#008FFB",
          },
        },
        title: {
          text: "Amount (in thousand crores)",
          style: {
            color: "#008FFB",
          },
        },
        tooltip: {
          enabled: true,
        },
      },
    ],
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft",
        offsetY: 30,
        offsetX: 60,
      },
    },
    legend: {
      horizontalAlign: "left",
      offsetX: 40,
    },
  };

  const series = [
    {
      type: "bar",
      stack: "",
      yAxisKey: "eco",
      data: [2, 5, 3, 4, 1],
    },
    {
      type: "bar",
      stack: "",
      yAxisKey: "eco",
      data: [5, 6, 2, 8, 9],
    },
  ];

  useEffect(() => {
    getSales();
    getBuyersSuppliers();
    getItemData();
  }, []);

  const state = {
    series: [
      { name: "CLOTHING", data: [44, 55, 41, 67, 22, 43] },
      { name: "SHOES", data: [13, 23, 20, 8, 13, 27] },
      { name: "ACCESSORIES", data: [11, 17, 15, 15, 21, 14] },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      xaxis: {
        type: "datetime",
        categories: [
          "01/01/2011 GMT",
          "01/02/2011 GMT",
          "01/03/2011 GMT",
          "01/04/2011 GMT",
          "01/05/2011 GMT",
          "01/06/2011 GMT",
        ],
      },
      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
    colors: ["#9399A1", "#10CBB7", "#008FFB"],
  };

  const trend = {
    series: [
      {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Product Trends by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
  };

  return (
    <div>
      {isDashboardLoading ? (
        <div
          className="skeleton-container"
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
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="layout-1">
          <SideBar navClick={navClick} side={side}/>
          {/* start: body area */}
          <div className="wrapper">
            {/* start: page header */}
            <NavBar navClick={navClick} setNavClick={setNavClick} side={side} setSide={setSide}/>
            {/* start: page toolbar */}
            <>
              {/* start: page body */}
              <div className="page-body px-xl-4 px-sm-2 px-0 py-lg-2 py-1 mt-0 mt-lg-3">
                <div className="container-fluid">
                  <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3 mb-3 row-deck">
                    <div className="col">
                      <div className="card">
                        <div className="card-body">
                          <div className="text-muted text-uppercase small">
                            Current Stock
                          </div>
                          <div className="mt-1">
                            <span className="fw-bold h4 mb-0">
                              {" "}
                              {sumOfStocks}{" "}
                            </span>
                            <span
                              className="text-success ms-1"
                              style={{ fontSize: "12px" }}
                            >
                              Unit
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card">
                        <div className="card-body">
                          <div className="text-muted text-uppercase small">
                            Profit
                          </div>
                          <div className="mt-1">
                            <span className="fw-bold h4 mb-0">
                              {" "}
                              {totalSign} ₹ {Math.abs(totalAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card">
                        <div className="card-body">
                          <div className="text-muted text-uppercase small">
                            Expense
                          </div>
                          <div className="mt-1">
                            <span className="fw-bold h4 mb-0">
                              {sumOfExpenses}
                            </span>
                            <span
                              className="text-success ms-1"
                              style={{ fontSize: "12px" }}
                            >
                              rupees
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card">
                        <div className="card-body">
                          <div className="text-muted text-uppercase small">
                            Product Sold
                          </div>
                          <div className="mt-1">
                            <span className="fw-bold h4 mb-0">
                              {sumOfStocksSold}
                            </span>
                            <span
                              className="text-success ms-1"
                              style={{ fontSize: "12px" }}
                            >
                              rupees
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* .row end */}

                  <div className="row g-3 row-deck">
                    <div className="col-xl-4 col-lg-4 col-md-6">
                      <div className="card-body">
                        <div
                          id="apex-QualityPurchase"
                          className="ac-line-transparent"
                        />
                        <div className="card" style={{ height: "60vh" }}>
                          <div className="card-header">
                            <h6 className="card-title m-0">
                              Stock Quantity
                              <small className="d-block text-muted">
                                Category wise
                              </small>
                            </h6>
                          </div>
                          <div
                            className="d-flex justify-content-center"
                            style={{ marginTop: "40px" }}
                          >
                            <ApexCharts
                              options={chartOptions}
                              series={chartOptions.series}
                              type="donut"
                              width={380}
                            />
                          </div>
                        </div>
                      </div>
                      {/* .card end */}
                    </div>

                    <div className="col-xl-4 col-lg-4 col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <ApexCharts
                            options={trend.options}
                            series={trend.series}
                            type="line"
                            height={350}
                          />
                        </div>
                      </div>
                      {/* .card end */}
                    </div>

                    <div className="col-xl-4 col-lg-4 col-md-6">
                      <div className="card-body">
                        <div
                          id="apex-QualityPurchase"
                          className="ac-line-transparent"
                        />
                        <div className="card" style={{ height: "60vh" }}>
                          <div className="card-header">
                            <h6 className="card-title m-0">
                              Payable Amount
                              <small className="d-block text-muted">
                                Buyer Seller Wise
                              </small>
                            </h6>
                          </div>
                          <div
                            className="d-flex justify-content-center"
                            style={{ marginTop: "40px" }}
                          >
                            <ApexCharts
                              options={chartPayableOptions}
                              series={chartPayableOptions.series}
                              type="donut"
                              width={380}
                            />
                          </div>
                        </div>
                      </div>
                      {/* .card end */}
                    </div>
                    {/* <div className="col-xl-6 col-lg-6 col-md-6">
                      <div className="card" style={{ padding: "20px" }}>
                        <div className="card-header">
                          <h6 className="card-title m-0">
                            Recievable Amount List
                          </h6>
                        </div>
                        <table
                          id="myDataTable_no_filter"
                          className="table myDataTable card-table mb-0"
                        >
                          <thead>
                            <th>CUSTOMER</th>
                            <th>MOBILE</th>
                            <th>PAYMENT</th>
                          </thead>

                          <tbody>
                            {currentSalesItems.map((item, index) => (
                              <tr key={index} style={{ cursor: "pointer" }}>
                                <td>{item.mobile}</td>
                                <td>{item.customerName}</td>
                                <td>{item.method}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div> */}

                    <div className="col-xl-6 col-lg-12 col-md-12">
                      <div className="card" style={{ padding: "20px" }}>
                        <div className="card-header">
                          <h6 className="card-title m-0">Sales Order</h6>
                        </div>
                        <div className="table-responsive">
                          <table
                            id="myDataTable_no_filter"
                            className="table myDataTable card-table mb-0"
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
                              </tr>
                            </thead>

                            <tbody>
                              {currentSalesItems.map((item, index) => (
                                <tr key={index} style={{ cursor: "pointer" }}>
                                  <td>{index + indexOfFirstSalesItem + 1}</td>
                                  <td>{item.mobile}</td>
                                  <td>{item.customerName}</td>
                                  <td>{item.method}</td>
                                  <td>₹ {item.totalDiscount}</td>
                                  <td>₹ {item.totalGST}</td>
                                  <td>₹ {item.totalAmount}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {/* .card end */}
                      </div>
                    </div>

                    <div className="col-xl-6 col-lg-12 col-md-12">
                      <div className="card">
                        <div className="card-header">
                          <h6 className="card-title m-0">Sales Statistics</h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <ApexCharts
                              options={state.options}
                              series={state.series}
                              type="bar"
                              height={350}
                            />
                          </div>
                          <div
                            id="apex-SalesStatistics"
                            className="ac-line-transparent"
                          />
                        </div>
                      </div>
                      {/* .card end */}
                    </div>
                  </div>
                  {/* .row end */}
                </div>
              </div>

              {/* start: page footer */}
              <footer className="page-footer px-xl-4 px-sm-2 px-0 py-3">
                <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center">
                  <p className="col-md-4 mb-0 text-muted">
                    © 2023
                    <a>Insta E Mart</a>, All Rights Reserved.
                  </p>
                </div>
              </footer>
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
